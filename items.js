var itemManager = class itemManager{
    constructor(itemData){
        console.log(itemData);
        this.itemData = itemData;
    }
    getItemName(itemId){
        console.log(this.itemData);
        return this.itemData[itemId].itemName;
    }
}