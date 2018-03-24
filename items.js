var itemManager = class itemManager{
    constructor(itemData){
        this.itemData = itemData;
    }
    getItemName(itemId){
        return this.itemData[itemId].itemName;
    }
}