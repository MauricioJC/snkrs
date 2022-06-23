fs = require('fs');
const fileName = "users.txt";
exports.Database = class {
    usuarios() {
        try{
            const data = fs.readFileSync(fileName, 'utf8');
            return JSON.parse(data);
        }catch(err){
            return [];
        }
    }

    async save(value) {
        fs.writeFile(fileName, JSON.stringify(value), function (err) {
            if (err) return console.log(err);
        });
    }
};