
const axios = require('axios');

export async function getPing() {

    try{
        const response = await axios.get('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/ping', {
        
            headers: {"Access-Control-Allow-Origin": "*"},
            mode: "no-cors"

        }       
        
        
        
        );
        console.log('response  ', response)
        return response.data;
    }catch(error) {
        return [];
    }
    
}

