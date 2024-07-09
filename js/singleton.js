class Singleton {
    static _instance = null

    static getInstance() {
        if (this._instance !== null) return this._instance;

        this._instance = new this(...arguments);
        return this._instance;
    }
}