/**
 * internationalization library class
 *
 * @class i18n
 */
export default class i18n {
    /**
     *  @var dictionaries Multilingual dictionary object
     */
    static dictionaries = {
        // English
        "en": {
            "title": "Habit yourself",
            "newHabitLabel": "New Habit",
            "newHabitPlaceholder": "Input new habit title",
            "date": "Date",
            "confirmDelete": "Are you sure you want to delete this habit?",
            "dialogSameNameExists": "This habit name already exists.",
        },
        // Japanese
        "ja": {
            "title": "Habit yourself",
            "newHabitLabel": "新しい習慣",
            "newHabitPlaceholder": "新しい習慣名を入力",
            "date": "日付",
            "confirmDelete": "この習慣を削除してもよろしいですか?",
            "dialogSameNameExists": "この習慣名はすでに存在します。",
        },
        // Spanish
        "es": {
            "title": "Hábitate tú mismo",
            "newHabitLabel": "Nuevo hábito",
            "newHabitPlaceholder": "Ingrese el nombre del nuevo hábito",
            "date": "fecha",
            "confirmDelete": "¿Estás segura de que quieres eliminar este hábito?",
            "dialogSameNameExists": "El nombre de este hábito ya existe.",
        },
        // Russian
        "ru": {
            "title": "Привыкайте себя",
            "newHabitLabel": "Новая привычка",
            "newHabitPlaceholder": "Введите новое название привычки",
            "date": "дата",
            "confirmDelete": "Вы уверены, что хотите удалить эту привычку?",
            "dialogSameNameExists": "Это название привычки уже существует.",
        },
        // French
        "fr": {
            "title": "Habituez-vous",
            "newHabitLabel": "Nouvelle habitude",
            "newHabitPlaceholder": "Entrez le nouveau nom de l'habitude",
            "date": "date",
            "confirmDelete": "Êtes-vous sûr de vouloir supprimer cette habitude ?",
            "dialogSameNameExists": "Ce nom d'habitude existe déjà.",
        },
        // German
        "de": {
            "title": "Machen Sie es sich zur Gewohnheit",
            "newHabitLabel": "Neue Gewohnheit",
            "newHabitPlaceholder": "Geben Sie einen neuen Gewohnheitsnamen ein",
            "date": "Datum",
            "confirmDelete": "Sind Sie sicher, dass Sie diese Gewohnheit löschen möchten?",
            "dialogSameNameExists": "Dieser Gewohnheitsname existiert bereits.",
        },
        // Chinese
        "zh_CN": {
            "title": "Habit yourself",
            "newHabitLabel": "新习惯",
            "newHabitPlaceholder": "输入新习惯名称",
            "date": "日期",
            "confirmDelete": "您确定要删除这个习惯吗？",
            "dialogSameNameExists": "这个习惯名称已经存在。",
        },
        // Chinese taipei
        "zh_TW": {
            "title": "習慣自己",
            "newHabitLabel": "新習慣",
            "newHabitPlaceholder": "輸入新習慣名稱",
            "date": "日期",
            "confirmDelete": "您確定要刪除這個習慣嗎？",
            "dialogSameNameExists": "這個習慣名稱已經存在。",
        },
        // korean
        "ko": {
            "title": "Habit yourself",
            "newHabitLabel": "새로운 습관",
            "newHabitPlaceholder": "새 습관명 입력",
            "date": "날짜",
            "confirmDelete": "이 습관을 삭제하시겠습니까?",
            "dialogSameNameExists": "이 습관 이름은 이미 존재합니다.",
        },
    }

    /**
     * Get the browser's display language
     * @returns {string} Current language
     */
    static lang() {
        const wn = window.navigator;
        return ((wn.languages && wn.languages[0]) || wn.language || wn.userLanguage || wn.browserLanguage).slice(0, 2);
    }

    /**
     * Get current language
     * @returns {string} Current language
     */
    static language() {
        const lang = this.lang();

        // Show English for undefined languages
        return this.dictionaries[lang] ? lang : "en";
    }

    /**
     * Get translated term
     * @param {string} term Term to be translated
     * @returns {string} Translated term
     */
    static translate(index) {
        return this.dictionaries[this.language()][index];
    }

    /**
     * Initialization of dictionary object
     */
    static translateAll() {
        const dictionary = this.dictionaries[this.language()];
        for (let elem of document.querySelectorAll('[data-translate]')) {
            elem.innerHTML = dictionary[elem.dataset.translate];
        }
    }
}
