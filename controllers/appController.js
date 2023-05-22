const path = require("path");
const db = require("../database");

//all requests here are already authenticated

const page_home = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/index.html"));
}

const page_create_list = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/createList.html"));
}

const post_create_list = async (req, res) => {
    const {title, terms} = req.body;

    if(!title){ return res.status(400).json("Titolo non valido") }

    const userId = res.locals.user["id"];

    //create new lesson
    db.connection.query("INSERT INTO Lists (Title, FKUser) VALUES (?, ?)", [title, userId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(400).json("Errore interno, riprova più tardi");
        }

        const listId = result.insertId;

        try{
            //if created, add every term
            terms.forEach(term => {
                db.connection.query("INSERT INTO Terms (Word, ForeignWord, FKList) VALUES (?, ?, ?)", [term.word, term.foreignWord, listId]);
            }); 

            return res.status(200).end();
        }
        catch(err){
            console.log(err);
            return res.status(500).json("Errore interno, riprova più tardi");
        }

        
    })
}

const getUserData = async (req, res) => {
    return res.status(200).json(res.locals.user);
}

const get_lists = async (req, res) => {
    const userId = req.params.userId;
    
    //get lesson data
    db.connection.query("SELECT PKList AS id, Title as title FROM Lists WHERE FKUser = ?", [userId], (err, result)=> {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno");
        }

        return res.status(200).json(result);
    })
}

const page_list_by_id = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/list.html"));
}

const data_list_by_id = async (req, res) => {
    const listId = req.params.listId;

    const listData = {
        id: "",
        title: "",
        terms: undefined
    };

    //get list data
    db.connection.query("SELECT PKList AS id, Title AS title FROM Lists WHERE PKList = ?", [listId], (err, result) => {
        listData.id = result[0]["id"];
        listData.title = result[0]["title"];
        //get all terms
        db.connection.query("SELECT Word AS word, ForeignWord AS foreignWord FROM Terms WHERE FKList = ?", [listData.id], (err, result) => {
            listData.terms = result;

            return res.status(200).json(listData);
        })
    })
}

const delete_list = async (req, res) => {
    const listId = req.params.listId;

    db.connection.query("DELETE FROM Lists WHERE PKList = ?", [listId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).end();
        }

        return res.status(200).end();
    })
}

const post_edit_list = async (req, res) => {
    const listId = req.body.listId;
    const newListData = req.body.newListData;

    db.connection.query("UPDATE Lists SET Title = ? WHERE PKList = ?", [newListData.title, listId], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno: impossibile aggiornare il titolo della lista");
        }

        //delete all terms to add the new ones
        db.connection.query("DELETE FROM Terms WHERE FKList = ?", [listId], (err, result) => {
            if(err){
                console.log(err);
                return res.status(500).json("Errore interno: impossibile aggiornare i vocaboli della lista");
            }

            //after deleting all the terms, add the new ones
            try{
                newListData.terms.forEach(term => {
                    db.connection.query("INSERT INTO Terms (Word, ForeignWord, FKList) VALUES (?, ?, ?)", [term.word, term.foreignWord, listId]);
                }); 
    
                return res.status(200).end();
            }
            catch(err){
                console.log(err);
                return res.status(500).json("Errore interno: impossibile aggiornare i vocaboli della lista");
            }
        })
    })
}

const page_edit_list = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/editList.html"));
}

module.exports = {
    page_home,
    page_create_list,
    post_create_list,
    getUserData,
    get_lists,
    data_list_by_id,
    page_list_by_id,
    delete_list,
    post_edit_list,
    page_edit_list
}
