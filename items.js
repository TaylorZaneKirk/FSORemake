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
            case 0: {
                return 'Head';
            }
            case 1: {
                return 'Torso';
            }
            case 2: {
                return 'Arms';
            }
            case 3: {
                return 'Legs';
            }
            case 4: {
                return 'Extra';
            }
            default: {
                return null;
            }
        }

    }
}