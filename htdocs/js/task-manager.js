class TaskManager {
    constructor(loadingModalId) {
        this.lastId = 0;
        this.loadingModalId = loadingModalId;
        this.taskList = [];
    }

    commit() {
        let currentTasks = this.taskList;
        this.taskList = [];

        for (let i=0; i<currentTasks.length; i++) {
            currentTasks[i]();
        }
    }

    newTask(task, name, description) {
        console.log(`New task: ${name} (${description})`);
        this.taskList.push(task);
        document.getElementById("task-list").innerHTML += `<li id="task-item-${name}">${description}</li>`;
        this.setLoadingScreen();
    }

    removeTask(name) {
        document.getElementById(`task-item-${name}`).remove();
        this.setLoadingScreen();
    }

    setDescription(forName, description) {
        document.getElementById(`task-item-${name}`).innerText = description;
    }

    setLoadingScreen() {
        document.getElementById(this.loadingModalId).style.display = document.getElementById("task-list").childElementCount > 0 ? "block" : "none";
    }

    // show() {
    //     document.getElementById(this.loadingModalId).style.display = "block";
    //     console.log("Show: " + this.loadingModalId);
    // }
    //
    // hide() {
    //     document.getElementById(this.loadingModalId).style.display = "none";
    //     console.log("Hide: " + this.loadingModalId);
    // }
}
