const express = require("express");
const router = express.Router();
const path = require("path");
const { google } = require('googleapis');
const calendar = google.calendar('v3');

async function main() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname,"../gAuth.json"),
        // Scopes can be specified either as an array or as a single, space-delimited string.
        scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
    });

    // Acquire an auth client, and bind it to all future calls
    const authClient = await auth.getClient();
    google.options({ auth: authClient });
}
main().catch(e => {
    console.error(e);
    throw e;
});

router.route("/event")
    .post((req, res) => {

        /*
            GENERAL CAL ID: vlgvatdb6sqccer3i5982bvl10@group.calendar.google.com
        */

        var googleEvent = {
            'summary': 'Test Event 1',
            'location': '5722 Lime Avenue, Long Beach, CA 90805',
            'description': 'Fun event for the family',
            'start': {
              'dateTime': '2022-03-24T09:00:00',
              'timeZone': 'America/Los_Angeles'
            },
            'end': {
              'dateTime': '2022-03-24T17:00:00',
              'timeZone': 'America/Los_Angeles'
            },/*
            'attendees': [
              {'email': 'furcht79@gmail.com'},
            ],*/
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10}
              ]
            }
        };

        //- Creates Calendar
        /*
        calendar.calendars.insert({
            requestBody: {
                primary: true,
                summary: "Announcements"
            }
        }, (err, cal)=>{
            if(err) {
                console.log(err);
                return;
            }
            console.log("NEW CALENDAR:", cal.data);
        });
        */



        //- Share Calendar
        /*
        calendar.acl.insert({
            calendarId: "vlgvatdb6sqccer3i5982bvl10@group.calendar.google.com",
            requestBody: {
                role: "reader",
                scope: {
                    type: "user",
                    value: "ccnlb.media@gmail.com"
                }
            }
        }, (err, cal)=> {
            if(err) {
                console.log(err);
                return;
            }
            console.log("CAL:", cal.data);
        });
        */




        //- Lists Calendars
        /*
        calendar.calendarList.list((err, cal)=>{
            if(err) {
                console.log(err);
                return;
            }
            console.log("CALENDAR:", cal.data);
        });
        */




        //- Add Event
        /*
        calendar.events.insert({
            'calendarId': 'vlgvatdb6sqccer3i5982bvl10@group.calendar.google.com',
            'resource': event
        }, (err, evt)=>{
            if(err) {
                console.log(err);
                return;
            }
            console.log("EVENT ADDED:", evt.data.htmlLink);
        });
        */




        //- List Events
        /*
        calendar.events.list({
            'calendarId': 'vlgvatdb6sqccer3i5982bvl10@group.calendar.google.com'
        }, (err, evt)=>{
            if(err) {
                console.log(err);
                return;
            }
            console.log("ALL EVENTS:", evt.data);
        });
        */



        //- Update Settings
        /*
        calendar.calendars.update({
            'calendarId': 'vlgvatdb6sqccer3i5982bvl10@group.calendar.google.com',
            'requestBody': {
                "summary": "Genz",
                "timeZone": "America/Los_Angeles"
            }
        }, (err, evt)=>{
            if(err) {
                console.log(err);
                return;
            }
            console.log("UPDATED SETTINGS:", evt.data);
        });
        */
        
        res.json({ "test": true });
    });

module.exports = router;