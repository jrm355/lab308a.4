//code sandbox forking brought me back to the beginning,
//I copied from original and manually replaced fetch with axios.get and json with data

import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_igJTgCIU6sy6ebhTjphioNJUsyIrUnEHz08klDYL8FbKuUbiIHZ5cxItYSB9pvzd";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * A Retrieve a list of breeds from the cat API using fetch().
 * B Create new <options> for each of these breeds, and append them to breedSelect.
 *  C Each option should have a value attribute equal to the id of the breed.
 *  D Each option should display text equal to the name of the breed.
 * E This function should execute immediately.
 */
//A
async function initialLoad() {
  try {
    //B
    const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    // C
    const breeds = await response.data;

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      //D
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error", error);
  }
}
//E
initialLoad();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * -  A: Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
//
breedSelect.addEventListener("change", handleBreedSelect);
handleBreedSelect();
async function handleBreedSelect() {
  //a
  const selectedBreedId = breedSelect.value;

  // Fetch data for the selected breed, download progress bar
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreedId}&limit=5`,
      {
        headers: { "x-api-key": API_KEY },
        onDownloadProgress: updateProgress,
      }
    );

    const data = await response.data;

    // Clear previous carousel elements and info
    Carousel.clear();
    infoDump.innerHTML = "";

    // Populate new carousel
    data.forEach((item) => {
      // Create carousel item for each image
      const imgElement = document.createElement("img");
      imgElement.src = item.url;
      Carousel.appendCarousel(imgElement);

      const breedInfo = document.createElement("div");
      breedInfo.innerHTML = `<h2>${item.breeds[0].name}</h2>
                             <p>${item.breeds[0].description}</p>`;
      infoDump.appendChild(breedInfo);
    });

    // Restarting carousel
    Carousel.start();
  } catch (error) {
    console.error("Error", error);
  }
}
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
//DONE
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
//I didn't know where to access this code. I used online rescources and my notes.

//  * - In your request interceptor, set the body element's cursor style to "progress."
axios.interceptors.request.use((config) => {
  {
    document.body.style.cursor = "progress";
  }
  document.getElementById("progressBar").style.width = "0%";
});
(config) => {
  config.metadata = { startTime: new Date() };
  console.log(
    `Request to ${config.url} started at ${config.metadata.startTime}`
  );
  return config;
},
  (error) => {
    return Promise.reject(error);
  };

// Add a response interceptor, reset the body cursor, if it doesn't work, it's / because I hate code sandbox
//  In your response interceptor, remove the progress cursor style from the body element.
axios.interceptors.response.use(
  (response) => {
    // Reset cursor to default
    document.body.style.cursor = "default";

    // Calculate request duration,
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`Request to ${response.config.url} took ${duration} ms`);

    return response;
  },
  (error) => {
    // Reset cursor to default in case of error
    document.body.style.cursor = "default";

    return Promise.reject(error);
  }
);

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
// on download function
//update progress function, rest of prompt is all over the freaking place
function updateProgress(event) {
  // console.log(event);
  if (event.lengthComputable) {
    const progress = Math.round((event.loaded * 100) / event.total);
    document.getElementById("progressBar").style.width = progress + "%"; // Update progress
  }
}

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 *  DONE UP TOP IN INTERCEPTORS
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  try {
    const headers = { "x-api-key": API_KEY };

    //checking to see if it is favorited, also how do you spell favorites? This lab man
    const response = await axios.get(
      "https://api.thecatapi.com/v1/favourites",
      {
        headers,
      }
    );

    const favourites = response.data;
    const favouriteItem = favourites.find((item) => item.image_id === imageId);

    if (favouriteItem) {
      // favorited then delete it
      await axios.delete(
        `https://api.thecatapi.com/v1/favourites/${favouriteItem.id}`,
        {
          headers,
        }
      );
      console.log(`Image ${imageId} removed from favourites`);
    } else {
      // If it's not favorited, post to the favourites, this word
      await axios.post(
        "https://api.thecatapi.com/v1/favourites",
        {
          image_id: imageId, // Required for the request
        },
        {
          headers,
        }
      );
      console.log(`Image ${imageId} added to favourites`);
    }
  } catch (error) {
    console.error("Error toggling favourite:", error);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
//I'm tired, I need a nap
