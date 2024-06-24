
const noteModel = (titulo_, conteudo_) => {
    let obj = new Object();
    obj = {
    titulo: titulo_,
    conteudo: conteudo_ 
    };

    return obj;
};

module.exports = noteModel;