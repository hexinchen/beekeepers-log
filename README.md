# Read me

This is the finished take-home project for Skychute by Hexin Chen, using React, Hasura and Apollo Client.

## Usage:
 
 1. Run the demo on Heroku
	[link](https://floating-springs-70148.herokuapp.com/)
	
 2. Use npm to run on localhost:3000
	 run **npm install** then **npm start**

## Description

This application is to be used for keeping track of bee colonies regarding each colony size, each collection(honey amount in grams and collection date will be recorded) of the colony. 

You will first see a grid view of all the colonies in the system. On each block, you can view all the information of each colony fetched from the database, including:

 1. Id
 2. Estimated number of bees
 3. Hive number
 4. Last collection date
 
 The following values are calculated on the Front end:
 
 5. Next collection date (according to the requirement document it's 6 days after the latest collection date)
 6. Status indicating whether a honey collection process is needed or an additional hive is needed
 7. Overproduction (using the formula in the document)
 8. Progress bar showing how far it is from the current overproduction amount until 150g where a new hive needs to be built
 
 ## UI actions
 There are two actions on this application: 
 
 1. **Recording information for a honey collection process**: by clicking the button ***Record Collection***. This button will be disabled if today is not the due collection date yet("Next Collection Date" on the UI ). You could also record past collection information if you have missed one recording. For example: 

	Today is 17/01/2020, and the last collection date of colony 1 is 01/01/2020, which means a collection should have been due on 07/01/2020, hence you could record any missed collection information between 0/01/2020 and 17/01/2020

	Once you click Record Collection, you will be able to input collection information including honey amount (in grams) and the collection date. 0 or negative honey amount are not allowed, nor if honey amount exceeds the existing overproduction. Collection Date cannot be null or a date in the future.
		


 2. **Recording the adding of an additional hive**: by clicking the icon button "+". This icon button will be disabled if the current overproduction is less than 150g. Each click adds 1 more hive number to the colony and you can add multiple times until overproduction is less than 150g.(I'm not quite sure if this feature makes sense)
 
  

