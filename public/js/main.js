class Loves {
    constructor() {
        this.baseURL = '/api/v1/loves';
        this.loves = [];
        this.$loves = document.querySelector('.love-list');
        this.$form = document.querySelector('.love-form');
        this.$play = document.querySelector('.choose-list');
        this.$see = document.querySelector('.see-display');
        this.$seeTitle = document.querySelector('.see-title');
    }

    async init() {
        await this.updateLoves();

        this.$form.addEventListener('submit', async event => {
            event.preventDefault();
            await this.createLove();
        });
    }

    async getLoves() {
        let data = await fetch(this.baseURL);
        data = await data.json();
        this.loves = data;
        this.renderLoves();
    }

    async createLove() {
        try {
            const newData = {
                love: this.$form.love.value,
                day: this.$form.day.value
            };
            const options = {
                method: 'POST', 
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(newData)
            };
            let data = await fetch(this.baseURL, options);
            data = await data.json();
            await this.updateLoves();
        } catch(error) {
            console.error(error);
        }
    }

    async updateLove(id, newData) {
        try {
            const options = {
                method: 'PUT', 
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(newData)
            };
            let data = await fetch(this.baseURL+`/${id}`, options);
            data = await data.json();
            await this.updateLoves();

        } catch(error) {
            console.error(error);
        }
    }

    async deleteLove(id) {
        try {
            const options = {
                method: 'DELETE'
            };
            let data = await fetch(this.baseURL+`/${id}`, options);
            data = await data.json();
            this.updateLoves();
        } catch(error) {
            console.error(error);
        }
    }

    async updateLoves() {
        await this.getLoves();
        this.renderLoves();
        this.renderPlay();
    }

    renderLoves() {
        this.$loves.innerHTML = '';
        this.loves.forEach(item => {
            this.$loves.innerHTML += `
                <li class="love-item" id="${item._id}">
                    <form class="love-item__form">
                        <input class="input__list day" type="text" name="day" value="${item.day}">
                        <input class="input__list love" type="text" name="love" value="${item.love}">
                    </form>
                    <button class="love-item__delete">Delete</button>
                    <button class="love-item__edit">Edited</button>
                </li>
            `;
        });
        document.querySelectorAll('.love-item').forEach(item => {
            item.addEventListener('click', this.handleEditOrDelete.bind(this));
        });
    }

    async handleEditOrDelete(event) {
        const $clickedButton = event.target;
        const $listItem = event.currentTarget;
        console.log("clicked button: ",$clickedButton);
        console.log("list item: ",$listItem);

        if ($clickedButton.classList.contains('love-item__delete')) {
            await this.deleteLove($listItem.id);
            console.log('delete', $listItem.id);
        } else if ($clickedButton.classList.contains('love-item__edit')) {
            const form = $listItem.firstElementChild; 
            console.log("form children love: ",form.love.value);
            const updatedData = {
                "love": form.love.value,
                "day": form.day.value
            };
            console.log("handled: ", updatedData);
            await this.updateLove($listItem.id, updatedData); 
            console.log('edit', $listItem.id);
        }

    }

    renderPlay() {
        this.$play.innerHTML = '';
        this.loves.forEach(item => {
            this.$play.innerHTML += `
                <li class="play-item" id="${item._id}">
                    <button class="play__day">${item.day}</button>
                    <button class="play__love">${item.love}</button>
                </li>
            `;
        });
        document.querySelectorAll('.play-item').forEach(item => {
            item.addEventListener('click', this.handleSearch.bind(this));
        });
    }

    async handleSearch(event) {
        const $clickedButton = event.target;
        let day = false;
        console.log("word: ",$clickedButton.innerHTML);
        const results = this.loves.filter(word => {
            if ($clickedButton.classList.contains('play__day')) {
                if (word.day == $clickedButton.innerHTML) {
                    day = true;
                    return word;
                }
            } else if ($clickedButton.classList.contains('play__love')) {
                if (word.love == $clickedButton.innerHTML) {
                    return word;
                }
            }
        });
        console.log(results, day);
        await this.renderSee(results, day);
    }

    async renderSee(results, day) {
        if (this.$see.children) {
            this.$seeTitle.innerHTML = "";
            console.log("exist");
            let child = this.$see.lastElementChild;  
            while (child) { 
                this.$see.removeChild(child); 
                child = this.$see.lastElementChild; 
            }
        }
        if (day) {
            this.$seeTitle.innerHTML += `
                <h3 class="see-head-day">${results[0].day}</h3>
            `;
        } else {
            this.$see.innerHTML += `
                <h3 class="see-head-love">${results[0].love}</h3>
            `;
        }
        results.forEach(result => {
            if (day) {
                this.$see.innerHTML += `
                <li class="see-item" id="${result._id}">
                    <p class="see-love">${result.love}</p>
                </li>
            `;
            } else {
                this.$seeTitle.innerHTML += `
                <li class="see-item" id="${result._id}">
                    <p class = "see-day">${result.day}</p>
                </li>
            `;
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', async() => {
    const loves = new Loves();
    await loves.init();
});