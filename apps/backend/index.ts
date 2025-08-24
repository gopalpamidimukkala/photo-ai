import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from "@repo/common/types";
import { prismaClient } from "@repo/db"
import { S3Client } from "bun";
import { FalAIModel } from "./models/FalAIModel";
import cors from "cors"
import dotenv from "dotenv"
import { authMiddleware } from "./middleware";
import { fal } from "@fal-ai/client";

dotenv.config();

const PORT = process.env.PORT || 8080;

const falAiModel = new FalAIModel();

const app = express();

app.use(cors({
    origin: ["https://photo.pgopal.in", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }));
app.use(express.json());

app.get('/pre-signed-url', (req, res) => {
    try {
        const key = `models/${Date.now()}_${Math.random()}.zip`
        const url = S3Client.presign(key, {
            method: "PUT",
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
            endpoint: process.env.ENDPOINT,
            bucket: process.env.BUCKET_NAME,
            expiresIn: 60 * 5,
            type: "application/zip"
        });

        res.json({
            url,
            key
        })
    } catch (error) {
        console.log("Error in the Server")
    }
})

app.post('/ai/training/', authMiddleware, async (req, res) => {
       try {
            const parsedBody = TrainModel.safeParse(req.body)

            if(!parsedBody.success) {
                console.log(parsedBody.error.format());
                res.status(411).json({
                    message : "Input Incorrect",
                    errors: parsedBody.error.format()
                });
                return;
            }
           const { request_id, response_url} =  await falAiModel.trainModel(parsedBody.data.zipUrl, parsedBody.data.name)

            const data = await prismaClient.model.create({
                data : {
                    name : parsedBody.data.name,
                    type : parsedBody.data.type,
                    age  : parsedBody.data.age,
                    ethnicity : parsedBody.data.ethnicity,
                    eyeColor : parsedBody.data.eyeColor,
                    bald  : parsedBody.data.bald,
                    zipUrl : parsedBody.data.zipUrl,
                    userId : req.userId!,
                    falAiRequestId : request_id
                }
            })

            res.status(200).json({
                modelId : data.id
            })
       } catch (error) {
            console.log("Error in the Server")
       }
})

app.post('/ai/generate/', authMiddleware, async (req, res) => {
    try {
        const parsedBody = GenerateImage.safeParse(req.body);

        if(!parsedBody.success) {
            res.status(411).json({
                message : "Input Incorrect"
            })
            return
        }
        const model = await prismaClient.model.findUnique({
            where: {
                id: parsedBody.data.modelId
            }
        })

        if(!model || !model.tensorPath) {
            res.status(411).json({
                message: "Model Not Found"
            })
            return
        }

        const { request_id, response_url } = await falAiModel.generateImage(parsedBody.data.modelId, model.tensorPath)

        const data = await prismaClient.outputImages.create({
            data : {
                prompt : parsedBody.data.prompt,
                userId : req.userId!,
                modelId : parsedBody.data.modelId,
                imageUrl : "",
                falAiRequestId : request_id
            }
        })

        res.status(200).json({
            imageId : data.id
        })
    } catch (error) {
        console.log("Error in the Server")
    }
    
})

app.post('/pack/generate/', authMiddleware, async (req, res) => {
    try {
        const parsedBody = GenerateImagesFromPack.safeParse(req.body);
        console.log(parsedBody);

        if (!parsedBody.success ) {
            res.status(411).json({
                message : "Invalid Input"
            })
            return
        }
        const prompts = await prismaClient.packPrompts.findMany({
            where : {
                packId: parsedBody.data.packId 
            }
        })
        console.log("prompts",prompts)

        const model = await prismaClient.model.findFirst({
            where: {
                id : parsedBody.data.modelId
            }
        })
        console.log("model", model)
        if (!model) {
            res.status(411).json({
                message: "Model Not Found"
            })
            return
        }

        let requestIds: { request_id: string}[] = await Promise.all(
            prompts.map((prompt) => 
                falAiModel.generateImage(prompt.prompt, model.tensorPath! )
            )
        );
        console.log(requestIds);
        const images = await prismaClient.outputImages.createManyAndReturn({
            data: prompts.map((prompt, index) => ({
                prompt: prompt.prompt,
                userId: req.userId!,
                modelId: parsedBody.data.modelId,
                imageUrl: "",
                falAiModel: requestIds[index]?.request_id,
            }))
        })

        res.json({
            images: images.map((image) => image.id)
        })
    } catch (error) {
        console.log("Error in the Server")
    }
})

app.get('/pack/bulk/', async (req, res) => {
    try {
        const packs = await prismaClient.packs.findMany({})

        res.json({
            packs
        })
    } catch (error) {
        console.log("Error in the Server")
    }
})

app.get('/image/bulk', authMiddleware, async  (req, res) => {
    try {
        const ids = req.query.images as string[]
        const limit = req.query.limit as string ?? "10"
        const offset = req.query.offset as string ?? "0"

        const imagesData = await prismaClient.outputImages.findMany({
            where: {
                id: { in: ids },
                userId: req.userId!,
                status: {
                    not: "Failed"
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: parseInt(offset),
            take: parseInt(limit)
        })

        res.json({
            imagesData
        })
    } catch (error) {
        console.log("Error in the Server")
    }
})

app.get('/models', authMiddleware, async (req, res) => {
    try {
        const models = await prismaClient.model.findMany({
            where: {
                OR: [{ userId: req.userId }, { open: true }]
            }
        })
        res.status(200).json({
            models 
        })
    } catch (error) {
        console.log("Error in the Server")
    }
})

app.post('/fal-ai/webhook/train', async (req, res) => {
    try {
        const requestId = req.body.request_id as string;

        const result = await fal.queue.result("fal-ai/flux-lora", {
            requestId
        })
        //@ts-ignore
        const { imageUrl } = await falAiModel.generateImageSync(result.data.diffusers_lora_file.url)

        await prismaClient.model.updateMany({
            where: {
                falAiRequestId : requestId
            },
            data: {
                trainingStatus : "Generated",
                //@ts-ignore
                tensorPath: result.data.diffusers_lora_file.url,
                thumbnail: imageUrl
            }
        })
        res.json({
            message: "Webhook Received"
        })
        
    } catch (error) {
        console.log("Error in the Server")
    }
})

app.post('/fal-ai/webhook/image', async (req, res) => {
    try {
        const requestId = req.body.request_id;

        if (req.body.status === "ERROR") {
            res.status(411).json({})

            prismaClient.outputImages.updateMany({
                where: {
                    falAiRequestId: requestId
                },
                data:{
                    status: "Failed",
                    imageUrl: req.body.payload.images[0].url
                }
            })
        }
    
        await prismaClient.outputImages.updateMany({
            where: {
                falAiRequestId: requestId
            },
            data: {
                status: "Generated",
                imageUrl: req.body.payload.images[0].url
            }
        })
        res.json({
            message: "Webhook Received"
        })
    } catch (error) {
        console.log("Error in the Server")
    }

})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

