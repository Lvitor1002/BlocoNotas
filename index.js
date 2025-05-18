const corpoHtml = document.querySelector("body")
const btnAdd = document.getElementById("add")

const getItem = () => JSON.parse(localStorage.getItem('dbfun') || '[]')
const setItem = (db) => localStorage.setItem('dbfun',JSON.stringify(db))

function carregarNotas(){

    const db = getItem()
    
    db.forEach((nota)=> {

        renderizarNota(nota.texto, nota.id)  
    })
}

carregarNotas()

btnAdd.addEventListener("click",(evento)=>renderizarNota())



function renderizarNota(texto = "", id = Date.now()){

    const divNota = document.createElement("div")
    divNota.classList.add("nota")
    divNota.dataset.id = id // Armazena o ID na div
    
    const divCorpoNota = document.createElement("div")
    divCorpoNota.classList.add("estruturaNota")
    
    const btnEditar = document.createElement("button")
    btnEditar.classList.add("bi", "bi-pencil-fill", "edita")
    
    const btnSalvar = document.createElement("button")
    btnSalvar.classList.add("bi", "bi-floppy2", "salvar")
    
    const btnRemover = document.createElement("button")
    btnRemover.classList.add("bi", "bi-x-lg", "remove")

    const campoTexto = document.createElement("textarea")
    campoTexto.setAttribute("name","texto")
    campoTexto.setAttribute("id","idTexto")
    campoTexto.setAttribute("maxlength","500")

    // Desabilita o campo se for uma nota existente
    campoTexto.disabled = !!texto

    divCorpoNota.appendChild(btnEditar)
    divCorpoNota.appendChild(btnSalvar)
    divCorpoNota.appendChild(btnRemover)

    divNota.appendChild(divCorpoNota)
    divNota.appendChild(campoTexto)

    corpoHtml.appendChild(divNota)

    campoTexto.value = texto

    btnSalvar.addEventListener("click", function(evento) {

        const db = getItem()
        const posicao = db.findIndex(n => n.id === id)

        const novaNota = {
            id,
            texto: campoTexto.value
        }

        if(campoTexto.value.trim() === ''){

            campoTexto.style.border = '2px solid #ff4444';

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Não pode salvar uma nota vazia!',
            });
            return false;
        }

        if (posicao !== -1) {
            db[posicao] = novaNota
        } else {
            db.push(novaNota)
        }

        setItem(db)
        campoTexto.disabled = true // Bloqueia após salvar
        btnEditar.classList.replace("bi-check-lg", "bi-pencil-fill")

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Salvo com sucesso!",
            showConfirmButton: false,
            timer: 1500
        });
    })

    btnRemover.addEventListener("click",function(evento){
        
        divNota.remove()

        const db = getItem().filter(n => n.id !== id)
        setItem(db)

        Swal.fire({
            position: "center",
            title: `${campoTexto.value} removido(a)`,
            icon: "success",
            showConfirmButton: false,
            timer: 800
        });
    })


    btnEditar.addEventListener("click",function(evento){

        const editando = btnEditar.classList.contains("bi-pencil-fill")
        
        if(editando){
            campoTexto.disabled = false
            btnEditar.classList.replace("bi-pencil-fill", "bi-check-lg")
        }
        else
        {
            if(campoTexto.value.trim() === ''){

                campoTexto.style.border = '2px solid #ff4444';

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Não pode edtar uma nota vazia!',
                });
                return false;
            }

            campoTexto.style.border = '';
            campoTexto.disabled = true 
            btnEditar.classList.replace("bi-check-lg", "bi-pencil-fill")

            const db = getItem()
            const posicao = db.findIndex(n => n.id === id)

            if(posicao !== -1){
                db[posicao].texto = campoTexto.value
                setItem(db)
            }

            Swal.fire({
            position: "center",
            icon: "success",
            title: "Editado com sucesso!",
            showConfirmButton: false,
            timer: 1500
        });
        }
    })

    campoTexto.addEventListener('input', function() {
        this.style.border = ''; // Remove borda vermelha ao digitar
    });

}

