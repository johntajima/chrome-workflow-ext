# Chrome Workflow worker extension

A chrome extension that allows for manual processing/categorization/etc. of websites.

## How does it work?

Add a list of URLs you want to review and categorize/process.

Define a bunch of form elements which will be used collect information about each URL.

Starting the workflow will present the next URL and overlay the form with your input elements. Enter data and click 'save data' - it will save data in localStorage and move to the next URL.

At any time, you can download a CSV of your data you have saved.

## Use cases

This tool is useful for manually reviewing/categories/processing a large list of websites. For example, if you wanted to classify a bunch of website as to what category of products they sell, you could define form elements that you could pick a bunch of predefined categories, and cut and paste a list of urls in which to go through.


### Future

- Ability to query API endpoint to get next URL to process (remote list of URL)
- Ability to upload results to API endpoint (google docs, database)
- Ability to customize form based on type of url (different types forms for different types of URLs or project types)
- keyboard shortcuts
- ability to hide/show form


This project was created during Shopify Hackdays, Feb 2015
