class Loves {
    constructor() {
        this.baseURL = '/api/v1/loves';
        this.loves = [];
        this.$loves = document.querySelector('.love-list');
        this.$form = document.querySelector('.love-form');
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
        await this.renderLoves();
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
    }

    renderLoves() {
        this.$loves.innerHTML = '';
        this.loves.forEach(item => {
            this.$loves.innerHTML += `
                <li class="love-item" id="${item._id}">
                    <p>${item.day}</p>
                    <form class="love-item__form">
                        <input class="input__list" type="text" name="love" value="${item.love}">
                    </form>
                    <button class="love-item__delete">Delete!</button>
                    <button class="love-item__edit">Edited!</button>
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

        if ($clickedButton.classList.contains('love-item__delete')) {
            await this.deleteLove($listItem.id);
            console.log('delete', $listItem, $listItem.id, $listItem.love);
        } else if ($clickedButton.classList.contains('love-item__edit')) {
            const form = $listItem.firstElementChild; 

            const updatedData = {
                "love": form.love.value, 
                "day": form.day.value
            };
            console.log(updatedData);
            await this.updateLove($listItem.id, updatedData); 
            console.log('edit', $listItem.id);
        }

    }
}

window.addEventListener('DOMContentLoaded', async() => {
    const loves = new Loves();
    await loves.init();
});