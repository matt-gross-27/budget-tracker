# budget-tracker

AS AN avid traveler

I WANT to be able to track my withdrawals and deposits with or without a data/internet connection

SO THAT my account balance is accurate when I am traveling 


GIVEN a budget tracker without an internet connection

WHEN the user inputs an expense or deposit
THEN they will receive a notification that they have added an expense or deposit

WHEN the user reestablishes an internet connection
THEN the deposits or expenses added while they were offline are added to their transaction history and their totals are updated


NOTES
```
App must
- include a service worker.
- include a web manifest.
- use IndexedDB for offline functionality.
- be deployed to Heroku.
```

1. IndexedDB to add offline functionality
  - add idb.js file to the public/js/

  - Review Module 18: NoSQL, Lesson 4: Add Offline Persistence with IndexedDB

2. Add a service worker to the root of the public/

  - Review Module 19: Progressive Web Applications (PWA), Lesson 4: Using Service Workers

AFTER ONE AND TWO...

- enter deposits offline.

- enter expenses offline.

- Offline entries should be added to the tracker when the application is brought back online.

3. Add Manifest.json to the root of the public/
  - This manifest.json file for this project will contain the following properties:
    - name
    - short_name
    - icons
    - theme_color
    - background_color
    - start_url
    - display

4. Deployment to Heroku Using MongoDB Atlas
 - See 18.5.5: Deploy to Heroku.
