const jsonParser = query_object =>{
    for(const key in query_object){
        try {
            query_object[key] = JSON.parse(query_object[key]);
        } catch (err) {

        }
    }
    return query_object
}

module.exports = {jsonParser}