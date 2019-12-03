export function newTask(avatar, project, task, listName) {
  return `
  [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "You have been assigned a new task:\n *${project.name.toUpperCase()}*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "> *Description:*\n> [${listName}] - ${
    task.description
  }\n> *Difficulty:*\n> ${difficulty(task.difficulty)}\n> *Hours:*\n> ${
    task.hours
  }\n> *Start Date:* \n> ${timestampToDate(
    task.startdate
  )}\n> *Priority:* \n> ${task.priority}"
      },
      "accessory": {
        "type": "image",
        "image_url": "${avatar}",
        "alt_text": "thumbnail"
      }
    }
  ]
  `
}

export function newNote(user, task, projectname, listName, content) {
  return `[
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "📝 *${
          user.first_name
        }* has added a new note\n\n> *${projectname.toUpperCase()}* \n> Task: *${task}* [${listName}] \n> ${content}"
			} , "accessory": {
        "type": "image",
        "image_url": "${user.avatar}",
        "alt_text": "computer thumbnail"
      }
		}
	]`
}

export function newUpload(user, task, projectname, listName) {
  return `[
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "📁 *${
          user.first_name
        }* has uploaded a new file\n> Project: *${projectname.toUpperCase()}* \n> Task: *${task}* [${listName}] \n\n _Check it out, it may be for you._"
			} , "accessory": {
        "type": "image",
        "image_url": "${user.avatar}",
        "alt_text": "computer thumbnail"
      }
		}
	]`
}

export function taskCompleted(task, user, listName) {
  return `[
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "✔️ *${user.first_name}* has marked: [${listName}] - *${task.description}* as complete"
			} , "accessory": {
        "type": "image",
        "image_url": "${user.avatar}",
        "alt_text": "thumbnail"
      }
		}
	]`
}

function difficulty(level) {
  let difficultyLevel = {
    easy: "⚡",
    medium: "⚡⚡",
    difficult: "⚡⚡⚡",
    default: ""
  }
  return difficultyLevel[level] || difficultyLevel["default"]
}

// function priorityStyle(level) {
//   let priority = {
//     high: `"style":"danger"`,
//     medium: "",
//     low: `"style":"primary"`,
//     default: ""
//   }

//   return priority[level] || priority["default"]
// }

function timestampToDate(timestamp) {
  let date = new Date(timestamp.seconds * 1000)
  let month = date.getMonth()
  let day = date.getDate()
  let year = date.getFullYear()

  return `${day}/${month}/${year}`
}
