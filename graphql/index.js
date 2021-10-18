const users = [{id: 1, name: "Vasya", age: 25}]

const root = {
    getUser: ({id}) => {
        return users.find(user => user.id == id)
    }
}


module.exports = root;