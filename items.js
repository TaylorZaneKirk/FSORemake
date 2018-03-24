var itemManager = class itemManager{
    constructor(itemData){
        this.itemData = itemData;
    }
    getItemName(itemId){
        return this.itemData[itemId].itemName;
    }
    canEquip(itemId){
        return this.itemData[itemId].canEquip;
    }
    getEquipSlot(itemId){
        switch(this.itemData[itemId].equipSlot){
            case '0': {
                return 'head';
            }
            case '1': {
                return 'torso';
            }
            case '2': {
                return 'arms';
            }
            case '3': {
                return 'legs';
            }
            case '4': {
                return 'extra';
            }
            default: {
                return null;
            }
        }

    }
}