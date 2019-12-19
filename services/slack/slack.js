import Slack from "slack"
import Vue from "vue"
var blockTemplates = require("@/services/slack/blockTemplates.js")
const botOAuthToken = process.env.SLACK_BOT_OAUTH
const OAuthToken = process.env.SLACK_OAUTH

class SlackData {
  constructor(user, message, blocks, channel, users) {
    this.user = user ? user.user.id : null
    this._message = message
    this._blocks = blocks
    this.channel = channel
    this.users = users
  }

  get blocks() {
    return this._blocks || "[]"
  }
  set blocks(value) {
    this._blocks = value
  }

  get message() {
    return this._message || ""
  }

  set message(value) {
    this._message = value
  }
}
let data = new SlackData()

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
  data.message = message
  return getUserByEmail(userEmail)
    .then(() => {
      messageUser()
    })
    .catch(error => {
      Promise.reject(error)
    })
    .finally(() => {
      data = new SlackData()
    })
}

export function sendTaskNoteNotification(
  user,
  task,
  projectName,
  userEmails,
  listName,
  content
) {
  data.blocks = blockTemplates.newNote(
    user,
    task,
    projectName,
    listName,
    content
  )
  return getUsersList()
    .then(() => {
      userEmails.forEach(email => {
        data.user = data.users.members.find(x => x.profile.email == email)
        //Does not send to the user who made the note
        if (
          (!data.user || data.user.profile.email === user.email) &&
          !process.env.DEVELOPMENT
        )
          return
        messageUser()
      })
    })
    .then(result => {
      return Promise.resolve(result)
    })
    .catch(err => {
      return Promise.reject(err)
    })
    .finally(() => {
      data = new SlackData()
    })
}

export function sendTaskUploadNotification(
  user,
  task,
  projectName,
  userEmails,
  listName
) {
  data.blocks = blockTemplates.newUpload(user, task, projectName, listName)
  return getUsersList()
    .then(() => {
      userEmails.forEach(email => {
        data.user = data.users.members.find(x => x.profile.email == email)
        //Does not send to the user who uploaded the file
        if (
          (!data.user || data.user.profile.email === user.email) &&
          !process.env.DEVELOPMENT
        )
          return
        messageUser()
      })
    })
    .then(result => {
      return Promise.resolve(result)
    })
    .catch(error => {
      return handleError(error)
    })
    .finally(() => {
      data = new SlackData()
    })
}

export function sendTaskAssignedMessage(
  assignee,
  project,
  task,
  currentUser,
  listName
) {
  data.blocks = blockTemplates.newTask(assignee.avatar, project, task, listName)
  return Promise.all([
    getChannelById(project.channelId),
    getUserByEmail(assignee.email)
  ])
    .then(() => {
      //Does not send to the user who assigned the task
      if (
        (!data.user || data.user.profile.email === currentUser.email) &&
        !process.env.DEVELOPMENT
      )
        return
      messageUser()
    })
    .then(() => inviteUserToChannel())
    .catch(error => {
      return handleError(error)
    })
    .finally(() => {
      data = new SlackData()
    })
}

export function sendTaskCompletedMessage(project, task, user, listName) {
  data.blocks = blockTemplates.taskCompleted(task, user, listName)
  data.channel = { id: project.channelId }
  return messageChannel()
    .then(result => {
      return Promise.resolve(result)
    })
    .catch(error => {
      return handleError(error)
    })
}

export function addProjectChannel(name, description) {
  return getChannelByName(name)
    .then(() => {
      if (!data.channel) {
        //Only add description if creating the channel
        createChannel(name).then(() => addChannelDescription(description))
      }
    })
    .then(() => {
      return Promise.resolve(data.channel.id)
    })
    .catch(error => {
      return handleError(error)
    })
    .finally(() => {
      data = new SlackData()
    })
}

//Uses a legacy token which is aparently depricated and won't be supported forever
//Apps and bots don't have post auth scope which is needed to delete a channel so do not see another way of doing this now
/* 
[Channel Deletion]
*/
export function deleteChannelById(channelId) {
  Vue.axios
    .post(
      `https://slack.com/api/channels.delete?token=${OAuthToken}&channel=${channelId}`
    )
    .then(response => {
      Promise.resolve(response)
    })
    .catch(error => {
      return handleError(error)
    })
}

export function deleteChannelByName(channelName) {
  return getChannelByName(channelName)
    .then(() => {
      deleteChannelById(data.channel.id)
    })
    .then(() => {
      Promise.resolve("channel Deleted")
    })
    .catch(error => {
      return handleError(error)
    })
}

export function getChannelByName(channelName) {
  return Slack.channels
    .list({
      token: OAuthToken
    })
    .then(list => {
      const channel = list.channels.find(
        x => x.name.toLowerCase() === channelName.toLowerCase()
      )
      if (channel) data.channel = channel
    })
    .catch(error => {
      return handleError(error)
    })
}

/*
[Internal Functions]
*/
function addChannelDescription(description) {
  return Slack.channels
    .setPurpose({
      token: OAuthToken,
      purpose: description,
      channel: data.channel.id
    })
    .catch(error => {
      return handleError(error)
    })
}

function messageChannel() {
  return Slack.chat
    .postMessage({
      token: botOAuthToken,
      channel: data.channel.id,
      text: data.message,
      blocks: data.blocks
    })
    .catch(error => {
      return handleError(error)
    })
}

function createChannel(name) {
  return Slack.channels
    .create({
      token: OAuthToken,
      name: name
    })
    .then(channel => (data.channel = channel.channel))
    .catch(error => {
      return handleError(error)
    })
}

function getUserByEmail(userEmail) {
  return Slack.users
    .lookupByEmail({
      token: botOAuthToken,
      email: userEmail
    })
    .then(user => {
      data.user = user.user
      Promise.resolve()
    })
    .catch(error => {
      Promise.reject(error)
    })
}

function messageUser() {
  return Slack.chat
    .postMessage({
      token: botOAuthToken,
      channel: data.user.id,
      text: data.message || "",
      blocks: data.blocks || "[]",
      as_user: true
    })
    .catch(err => {
      Promise.reject(err)
    })
}

function inviteUserToChannel() {
  return Slack.channels
    .invite({
      token: OAuthToken,
      channel: data.channel.id,
      user: data.user.id
    })
    .catch(error => {
      if (!error.message == "already_in_channel") throw error
    })
}

function getChannelById(id) {
  return Slack.channels
    .list({
      token: OAuthToken
    })
    .then(channels => {
      data.channel = channels.channels.find(x => x.id == id)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

function getUsersList() {
  return Slack.users
    .list({
      token: botOAuthToken
    })
    .then(users => (data.users = users))
}

function handleError(error) {
  return Promise.reject(error)
}

export default Slack
