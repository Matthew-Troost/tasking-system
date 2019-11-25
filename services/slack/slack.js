import Slack from "slack"
import Vue from "vue"
var blockTemplates = require("@/services/slack/blockTemplates.js")
//var Util = require("@/utils/index.js")
const botOAuthToken = process.env.SLACK_BOT_OAUTH
const OAuthToken = process.env.SLACK_OAUTH

export const functions = {
  MESSAGE: {
    USER: {
      BY_EMAIL: "message.user.by_email"
    },
    CHANNEL: {
      BY_NAME: "message.channel.by_name",
      BY_ID: "message.channel.by_id"
    }
  },
  TASK_NOTIFICATION: {
    NOTE_ADDED: "task_notification.note_added",
    UPLOAD_ADDED: "task_notification.upload_added",
    ASSIGNED: "task_notification.assigned",
    COMPLETED: "task_notification.completed"
  }
}

export function messageUserByEmail(userEmail, message) {
  return new Promise((resolve, reject) => {
    Slack.users
      .lookupByEmail({
        token: botOAuthToken,
        email: userEmail
      })
      .then(user => {
        Slack.chat
          .postMessage({
            token: botOAuthToken,
            channel: user.user.id,
            text: message,
            as_user: true
          })
          .then(result => {
            resolve(result)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function sendTaskNoteNotification(
  user,
  task,
  projectName,
  userEmails,
  listName
) {
  return new Promise((resolve, reject) => {
    let blocks = blockTemplates.newNote(user, task, projectName, listName)
    Slack.users
      .list({
        token: botOAuthToken
      })
      .then(slackUsers => {
        userEmails.forEach(email => {
          let slackUser = slackUsers.members.find(x => x.profile.email == email)
          //Does not send to the user who made the note
          // if (!slackUser || slackUser.profile.email === user.email) return
          Slack.chat
            .postMessage({
              token: botOAuthToken,
              channel: slackUser.id,
              text: "",
              blocks: blocks,
              as_user: true
            })
            .then(result => {
              resolve(result)
            })
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}
export function sendTaskUploadNotification(
  user,
  task,
  projectName,
  userEmails,
  listName
) {
  return new Promise((resolve, reject) => {
    let blocks = blockTemplates.newUpload(user, task, projectName, listName)
    Slack.users
      .list({
        token: botOAuthToken
      })
      .then(slackUsers => {
        userEmails.forEach(email => {
          let slackUser = slackUsers.members.find(x => x.profile.email == email)
          //Does not send to the user who uploaded the file
          // if (!slackUser || slackUser.profile.email === user.email) return
          Slack.chat
            .postMessage({
              token: botOAuthToken,
              channel: slackUser.id,
              text: "",
              blocks: blocks,
              as_user: true
            })
            .then(result => {
              resolve(result)
            })
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function sendTaskAssignedMessage(
  assignee,
  project,
  task,
  currentUser,
  listName
) {
  let blocks = blockTemplates.newTask(assignee.avatar, project, task, listName)
  return new Promise((resolve, reject) => {
    Slack.users
      .lookupByEmail({
        token: botOAuthToken,
        email: assignee.email
      })
      .then(user => {
        //Add user to channel
        Slack.channels.invite({
          token: OAuthToken,
          channel: project.channelId,
          user: user
        })
        //Does not send if user added themselves
        // if (user.user.profile.email === currentUser.email) return
        Slack.chat
          .postMessage({
            token: botOAuthToken,
            channel: user.user.id,
            text: "",
            blocks: blocks,
            parse: "application/json",
            as_user: true
          })
          .then(result => {
            resolve(result)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function sendTaskCompletedMessage(project, task, user, listName) {
  return new Promise((resolve, reject) => {
    let blocks = blockTemplates.taskCompleted(task, user, listName)
    messageChannelById(project.channelId, "", blocks)
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addProjectChannel(name, description) {
  return new Promise((resolve, reject) => {
    Slack.channels
      .create({
        token: OAuthToken,
        name: name
      })
      .then(channel => {
        Slack.channels
          .setPurpose({
            token: OAuthToken,
            purpose: description,
            channel: channel.channel.id
          })
          .then(() => {
            resolve(channel)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function messageChannelByName(channelName, message) {
  return new Promise((resolve, reject) => {
    getChannelByName(channelName)
      .then(channel => {
        Slack.chat
          .postMessage({
            token: botOAuthToken,
            channel: channel.id,
            text: message
          })
          .then(result => {
            resolve(result)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function messageChannelById(channelId, message, optionalBlocks) {
  return new Promise((resolve, reject) => {
    Slack.chat
      .postMessage({
        token: botOAuthToken,
        channel: channelId,
        text: message,
        blocks: optionalBlocks
      })
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function createChannel(name, optionalMessage) {
  return new Promise((resolve, reject) => {
    Slack.channels
      .create({
        token: OAuthToken,
        name: name
      })
      .then(channel => {
        if (optionalMessage) {
          Slack.chat.postMessage({
            token: OAuthToken,
            channel: channel.channel.id,
            text: optionalMessage
          })
        }
        resolve(channel)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//Uses a legacy token which is aparently depricated and won't be supported forever
//Apps and bots don't have post auth scope which is needed to delete a channel so do not see another way of doing this now
export function deleteChannelById(channelId) {
  return new Promise((resolve, reject) => {
    Vue.axios
      .post(
        `https://slack.com/api/channels.delete?token=xoxp-823708849781-823708850917-830716278257-1777cf3a58818bb7ab17d75abcec9092&channel=${channelId}`
      )
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function test(input) {
  return new Promise((resolve, reject) => {
    Vue.axios
      .get(input)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function deleteChannelByName(channelName) {
  return new Promise((resolve, reject) => {
    getChannelByName(channelName)
      .then(channel => {
        Vue.axios
          .post(
            `https://slack.com/api/channels.delete?token=xoxp-823708849781-823708850917-830716278257-1777cf3a58818bb7ab17d75abcec9092&channel=${channel.id}`
          )
          .then(response => {
            resolve(response)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getChannelByName(channelName) {
  return new Promise((resolve, reject) => {
    Slack.channels
      .list({
        token: OAuthToken
      })
      .then(list => {
        const channel = list.channels.find(
          x => x.name.toLowerCase() === channelName.toLowerCase()
        )
        resolve(channel)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default Slack
