/**
 * Returns a new element with the given tag name.
 * @class Habit
 * @property {string} name
 * @property {string} date
 * @property {int} check
 */
export default class Habit {
    /**
     *
     * @param {string} name
     * @param {string} date YYYY/MM/DD
     * @param {int} checked 0 = false, !0 = true
     */
    constructor(name, date, checked = 0) {
        this.name = name;
        this.date = date;
        this.checked = checked;
    }

    /**
     * Sorts the array by date.
     * @param {Habit[]} habits
     * @param {string} order "asc" or "desc"
     */
    static sortByDate(habits, order = "asc") {
        if (order == "asc") {
            habits.sort((a, b) => {
                if (a.date < b.date) {
                    return -1;
                } else {
                    return 1;
                }
            });
        } else {
            habits.sort((a, b) => {
                if (a.date > b.date) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }
    }

    /**
     * Returns an array of unique custom names.
     * @param {Habit[]} habits
     * @returns {string[]}
     */
    static getNames(habits) {
        if (habits && habits.length == 0) {
            return [];
        }
        return [...new Set(habits.map(habit => habit.name))];
    }

    /**
     * Returns an array of habits with the specified custom name.
     * @param {Habit[]} habits
     * @param {string} name
     * @returns {habit[]}
     * @example
     */
    static fillterByName(habits, name) {
        if (habits && habits.length == 0) {
            return [];
        }
        return habits.filter(habit => habit.name == name);
    }

    /**
     * Update the array of received habits.
     * @param {Habit[]} habits
     * @param {Habit} newInstance
     * @returns {Habit[]}
     */
    static update(habits, newInstance) {
        if (habits && habits.length == 0) {
            return [newInstance];
        }

        for (const habit of habits ?? []) {
            if (habit.name == newInstance.name && habit.date == newInstance.date) {
                habit.checked = newInstance.checked;
            }
        }
        return habits;
    }

    /**
     * Compresses the array of received habits.
     * @param {Habit[]} habits
     * @returns {object}
     */
    static stringify(habits) {
        const saveData = {};
        for (const habit of habits) {
            if (!saveData[habit.name]) {
                saveData[habit.name] = {"d":"", "c":""};
                // Create a data array for 4 * 7 = 28 items in advance.
                // To allow access without changing the order by index.
                saveData[habit.name].c = "".padStart(Habit.fillterByName(habits, habit.name).length, "0");
            }
            // Update the date if the date is newer.
            const newDate = habit.date.replaceAll("/", "");
            if (saveData[habit.name].d <= newDate) {
                saveData[habit.name].d = newDate;
            }
            // Sets the executed flag at the location represented by the date.
            // The last date saved, the highest habit.date.
            const index = habits.indexOf(habit);
            const checkedString = saveData[habit.name].c;
            saveData[habit.name].c = checkedString.slice(0, index) + habit.checked + checkedString.slice(index + 1);
        }

        // Convert the binary string to a base36 string.
        for (const name of Object.keys(saveData)) {
            saveData[name].c = parseInt(saveData[name].c,2).toString(36);
        }
        return JSON.stringify(saveData);
    }

    /**
     * Decompresses the object of received habits.
     * @param {string} compressedHabitsJson
     * @returns {Habit[]}
     */
    static parse(compressedHabitsJson) {
        const compressedHabits = JSON.parse(compressedHabitsJson ?? "{}");
        let displayDays = 28;
        for (const name of Object.keys(compressedHabits)) {
            const habit = compressedHabits[name];
            const checkedLength = parseInt(habit.c, 36).toString(2).length;
            if (displayDays < checkedLength) {
                displayDays = checkedLength;
            }
        }

        const habits = [];
        for (const name of Object.keys(compressedHabits)) {
            const item = compressedHabits[name];
            const lastDate = item.d.slice(0, 4) + '/' + item.d.slice(4, 6) + '/' + item.d.slice(6);
            const calendar = Habit.getDaysArray(lastDate, displayDays);
            const checked = parseInt(item.c, 36).toString(2).padStart(displayDays,"0").split("");
            for (const i in checked) {
                const date = calendar[i];
                habits.push(new Habit(name, date, checked[i]));
            }
        }
        return habits;
    }

    /**
     * Returns a calendar that goes back the specified number of days
     * from the specified last day or today as an array of strings.
     * @param {string|null} lastDate Last day of this calendar. e.g.) "YYYY/MM/DD". Default is today.
     * @param {int} days Number of days to display. Default is 28.
     * @returns {string[]} Array of strings representing the calendar for one month
     */
    static getDaysArray(lastDate = null, days = 28) {
        const date = lastDate ? new Date(lastDate) : new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = date.getDate();
        const daysArray = [];
        for (let offset = 0; offset < days; offset++) {
            const day = new Date(year, month, today - offset);
            const YY_MM_DD = year + "/" + ("0" + (day.getMonth() + 1)).slice(-2) + "/" + ("0" + day.getDate()).slice(-2);
            daysArray.push(YY_MM_DD);
        }

        // Reverse the array to display the calendar in ascending order.
        return  daysArray.reverse();
    }

    /**
     * Returns all elements from the array except for the element with the specified name value.
     * @param {string} name
     * @returns {Habit[]}
     */
    static removeByName(habits, name) {
        if (habits && habits.length == 0) {
            return [];
        }
        return habits.filter(habit => habit.name != name);
    }

    /**
     * Adds and returns an array of customs for the specified date.
     * @param {Habit[]} habits
     * @param {string} name
     * @returns {Habit[]}
     */
    static addHabit(habits, name) {
        if (Habit.getNames(habits).includes(name)) {
            return habits;
        }
        const daysArray = Habit.getDaysArray();
        for (const date of daysArray) {
            const habit = new Habit(name, date)
            habits.push(habit);
        }
        return habits;
    }
}
