/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const http = require('http');

const APP_ID = 'amzn1.ask.skill.594dd412-0424-478c-8914-3eb766de70bb'; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Bear Switch',
            WELCOME_MESSAGE: "Welcome to %s. Use Left and Right to pick a switch and On and Off",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "You can say Switch Right On, and I will probably do that",
            HELP_REPROMT: "You can say Turn Left Off and I'll consider it",
            STOP_MESSAGE: 'Goodbye!'
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'Bear Switch',
        },
    },
    'en-GB': {
        translation: {
            SKILL_NAME: 'Bear Switch',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'SwitchControl': function () {
        const state = this.event.request.intent.slots.state.value;
        const relay = this.event.request.intent.slots.switch.value;
        
        let pin;
        let switchposition;
        if (relay == 'left') {
            pin = 23;
        }else{
            pin = 24;
        }
        
        let speechOutput;
        if(state == 'on'){
            switchposition = 0;
            speechOutput = 'ILLUMINATE!';
        }else{
            switchposition = 1;
            speechOutput = 'Oh No, darkness...';
        }

        http.get({
            hostname: '',
            port: 8082,
            path: '/operate?pin=' + pin + '&switchposition=' + switchposition,
            agent: false  // create a new agent just for this one request
            }, (res) => {
               this.emit(':tell', speechOutput);
            })
        
        
        
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
