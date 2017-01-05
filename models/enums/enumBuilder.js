module.exports = class enumBuilder{
    constructor(...args){
        this.raw = [...args];
        this.enumLookup = {};
        this.raw.reduce((prev, arg, i) => {
            prev[arg] = i;
        }, this.enumLookup);
    }
}