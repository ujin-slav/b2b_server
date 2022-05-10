module.exports = function(checked,nodes){
    let resultArray = []

    checked.map((itemChecked)=>{
        nodes.map((itemNodes)=>{
            if(itemChecked===itemNodes.value){
                if(!resultArray.includes(itemNodes.gis)){
                    resultArray.push(itemNodes.gis)
                }  
            }
            if(itemNodes.children){
                itemNodes.children.map((itemChildren)=>{
                    if(itemChecked===itemChildren.value){
                        if(!resultArray.includes(itemNodes.gis)){
                            resultArray.push(itemNodes.gis)
                        }  
                    }
                })
            }
        })
    })
    
    return resultArray
}    