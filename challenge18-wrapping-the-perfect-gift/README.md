# Challenge 18: Wrapping the perfect gift

![gift](https://res.cloudinary.com/jen-looper/image/upload/v1576271295/images/challenge-18_hraoqx.jpg)

## Time for an Australian Christmas day BBQ on the beach

Santa's Elves are wrapping all of this year's gifts and they're looking for an automated way to confirm that each has been wrapped properly. According to Santa, each present must be wrapped according to the following rules:

1. Placed in a box
2. Box is wrapped
3. A bow / ribbon placed on top

Luckily [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services?WT.mc_id=25daysofserverless-github-cxa) offers an easy way to do this using the [Computer Vision API](https://azure.microsoft.com/services/cognitive-services/computer-vision?WT.mc_id=25daysofserverless-github-cxa)!

Using Santa's [example of a perfectly wrapped gift](https://user-images.githubusercontent.com/13558917/70572373-88876980-1b54-11ea-8cd5-af07306b6d19.jpg), the Computer Vision API confirms the following Tags:

- [x] Box
- [x] Gift Wrapping
- [x] Ribbon
- [x] Present

[![Computer Vision Results Example](https://user-images.githubusercontent.com/13558917/70573740-71964680-1b57-11ea-9126-e71f2de14a45.png)](https://azure.microsoft.com/services/cognitive-services/computer-vision?WT.mc_id=25daysofserverless-github-cxa)

## Getting Started 🔥

To solve this challenge, let's do the following:

1. Generate a Computer Vision API Key
   - [Using the Azure Portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account?WT.mc_id=25daysofserverless-github-cxa)
   - [Using the Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli?WT.mc_id=25daysofserverless-github-cxa)
2. Create an Azure Function that uses a [Blob Storage Trigger](https://docs.microsoft.com/azure/azure-functions/functions-create-storage-blob-triggered-function?WT.mc_id=25daysofserverless-github-cxa)
   - The Blob Storage Trigger will automatically run our Azure Function code each time a new file is uploaded to [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs?WT.mc_id=25daysofserverless-github-cxa)
   - We can leverage the solution from the [Week 13 Challenge: The Yule Lads](https://dev.to/azure/build-your-jokes-generator-using-machine-learning-and-serverless-5g4a), which also used Blob Storage Triggers
3. In our Blob Trigger Function, write code that uses the [Computer Vision API](https://westus.dev.cognitive.microsoft.com/docs/services/5cd27ec07268f6c679a3e641/operations/56f91f2e778daf14a499f21b?WT.mc_id=25daysofserverless-github-cxa) to verify the image of each gift

# Solution

## Technologies

- Azure Functions with TypeScript
- Azure Blob Storage
- Azure Computer Vision API
- [Microsoft Azure SDK for Node.js - Cognitive Services Computer Vision](https://github.com/azure/azure-sdk-for-node/tree/master/lib/services/computerVision)
