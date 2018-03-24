var itemManager = class itemManager{
    constructor(){}
    getItemName(itemId){
        switch(itemId){
            case 1: {
                return 'NOTHING';
            }
            case 2: {
                return 'knife';
            }
            default: {
                return 'NOTHING';
            }
        }
    }
}