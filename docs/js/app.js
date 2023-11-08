import Habit from "./habit.js";
import { $$one, $$all, $$new } from "./indolence.js";
import i18n from "./i18n.js";

// First 8 characters of md5 hash of "habit-yourself" is "088c9905"
// const DEBUG = !false;
const APP_NAME = "habit-yourself";
const STORAGE_KEY = APP_NAME + " contents";
const SAMPLE_HABITS = "Sample habit";
const HABBIT_ROW_HTML = `<th>${SAMPLE_HABITS}</th><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><th><span class="material-symbols-outlined">delete</span></th>`;

/**
 * Saves the habit object to localStorage.
 * @param {Habit[]} habits
 */
const save = (habits) => {
    localStorage.setItem("DEUBG_" + STORAGE_KEY, JSON.stringify(habits))
    localStorage.setItem(STORAGE_KEY, Habit.stringify(habits));
}

/**
 * Loads the habit object from localStorage.
 * @returns {Habit[]} habits
 */
const load = () => {
    return Habit.parse(localStorage.getItem(STORAGE_KEY));
}

/**
 * Returns a new element with the given tag name.
 * @param {string} name New habit name
 * @returns {HTMLElement}
 */
const createNewRow = (name) => {
    const newRow = $$new("tr");
    newRow.dataset.name = name;
    newRow.innerHTML = HABBIT_ROW_HTML.replace(SAMPLE_HABITS, name);
    return newRow;
}

const addRow = (habits, name) => {
    // Add a row
    $$one("tbody").appendChild(createNewRow(name));
    // Set a habit name to the first column
    $$one("tbody>tr:last-child").dataset.name = name;
    $$one("tbody>tr:last-child>th:first-child").textContent = name;
    // Set a habit name to the del button
    const deleteCell = $$one("tbody>tr:last-child>th:last-child");
    deleteCell.dataset.name = name;
    const tdCells = $$all(`tbody>tr[data-name='${name}']>td:nth-child(n+2):nth-last-child(n+2)`);
    // If there is no habit objects with the specified name, create new.
    habits = Habit.addHabit(habits, name);
    save(habits);

    // Get the habit object with the specified name
    const habitArray = Habit.fillterByName(habits, name);

    for (const i in habitArray) {
        // Check if your date habits are complete.
        const td = tdCells[i];
        if (!td) {
            continue;
        }
        td.dataset.checked = habitArray[i].checked;
        td.dataset.date = habitArray[i].date;
        td.dataset.name = habitArray[i].name;

        // Add an event listener to the checkbox
        td.addEventListener("click", e => {
            const dataset = e.target.dataset;
            dataset.checked = parseInt(dataset.checked) ? 0 : 1;
            const habits = load();

            // Update the habit object
            const updatedHabits = Habit.update(habits, new Habit(dataset.name, dataset.date, dataset.checked));
            save(updatedHabits);
        });
    }

    // Click the del button to delete that line.
    // Also delete it from habits and update habits.
    deleteCell.addEventListener("click", e => {
        if (confirm(i18n.translate("confirmDelete"))) {
            const name = e.currentTarget.dataset.name;
            $$one(`tbody>tr[data-name='${name}']`).remove();
            const habits = Habit.removeByName(load(), name);
            save(habits);
        }
    });
}

/**
 * Displays the habit tracker.
 * @param {Habit[]} habits
 * @param {string[]} daysArray
 * @returns {void}
 */
const displayHabitTracker = (habits, daysArray) => {
    // Create a heading column
    const thCells = $$all("thead>tr>th:nth-child(n+2):nth-last-child(n+2)");
    let date;
    for (const i in daysArray) {
        // Color Saturday and Sunday
        date = daysArray[i];
        const weekOfDay = new Date(date).getDay();
        if (weekOfDay === 6) {
            thCells[i].classList.add("saturday");
        } else if (weekOfDay === 0) {
            thCells[i].classList.add("sunday");
        }

        // If the date is the first day of the month, add the year to the date.
        if (i !== "0" && date.slice(-2) !== "01")  {
            date = date.slice(-2);
        } else {
            // Add a line break to the date to make it easier to read when the year enters.
            date = date.slice(0, -3) + "<br>" + date.slice(-2);
        }

        thCells[i].innerHTML = date;

        // If there is a date that is not registered, create an instance and add it.
        // #TODO HabitCollectionクラスを作って、そこに移動する。
        const habitNames = Habit.getNames(habits);
        for (const name of habitNames) {
            const onTheDayHabit = habits.filter(habit => habit.name === name && habit.date === daysArray[i]);
            if (onTheDayHabit.length === 0) {
                habits.push(new Habit(name, daysArray[i]));
            }
        }
        save(habits);
    }

    // Display a habit name checklist row by row.
    let habitNames = Habit.getNames(habits);
    if (habitNames.length === 0) {
        habitNames = [SAMPLE_HABITS];
    }
    for (const habitName of habitNames) {
        addRow(habits, habitName);
    }
}

// Click the Add button to add up to 50 characters from the beginning of the string
//  in the text box to the bottom line of tbody.
$$one("header button").addEventListener("click", e => {
    const textbox = $$one("#text-add-habit");
    const name = textbox.value.slice(0, 50);
    if (name.length > 0) {
        // Check if the name already exists.
        const habits = load();
        if (Habit.getNames(habits).includes(name)) {
            alert(i18n.translate("dialogSameNameExists"));
            return;
        }
        // Add a row
        addRow(habits, name);
        // Clear text box.
        textbox.value = "";
    }
});

// Fires the add button's click event when the Enter key is pressed in the text box.
$$one("#text-add-habit").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        $$one("header button").click();
    }
});

/**
 * Displays the habit tracker.
 * I want to reduce the number of variables in global scope.
 */
window.addEventListener("load", () => {
    // Display the habit tracker.
    displayHabitTracker(load(), Habit.getDaysArray());
    i18n.translateAll();
    $$one("#text-add-habit").placeholder = i18n.translate("newHabitPlaceholder");
});
