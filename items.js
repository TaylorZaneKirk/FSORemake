var itemManager = class itemManager{
    constructor(itemData){
        this.itemData = null;
        for (var item of itemData){
            this.itemData[item.itemId] = item;
        }
    }
    getItemName(itemId){
        console.log(this.itemData);
        return this.itemData[itemId].itemName;
    }
}