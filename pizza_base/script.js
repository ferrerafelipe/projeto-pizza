let cart = [];
let modalQt = 1;
let modalKey = 0;


//atalho para não ficar dando querySelector em tudo 
const c = function(el){  return document.querySelector(el);} //el é o elemento que a gente vai querer selecionar
const cs = function(el){  return document.querySelectorAll(el);}


// listagem das pizzas
pizzaJson.map(function(item, index){  //item = próprio item(pizza); index= numero do array do item expecifico 
    //clonando o item
    let pizzaItem = c('.models .pizza-item').cloneNode(true);//cloneNode clona o item e o que tem dentro dele
   
    pizzaItem.setAttribute('data-key', index); //chave das pizzas específicas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //preço! toFixed vai fixar 2 algarismo depois da virgula
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; //nome pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;//descrição pizza

    //EVENTO DE CLICK PARA ABRIR O MODAL
    //parte lincada para que quando clicar na pizza abra o modal SEM ATUALIZAR A TELA. foi bloqueado a ação inicial do click que para quando clicar não atualize a tela
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();  // preventDefault = previna a ação padrão

        let key = e.target.closest('.pizza-item').getAttribute('data-key');   //PEGA QUAL PIZZA FOI CLICADA. closest = ache o item mais proximo que tenha .pizza-item
        modalQt = 1 // quantidade de pizza resetada  = 1 quando abre o modal de determinada pizza
        modalKey = key; //VAI DIZER QUAL É A PIZZA

        c('.pizzaBig img').src = pizzaJson[key].img; // mostrando foto da pizza no modal
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; //nome da pizza no modal
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; //descrição da pizza no modal
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; //preço pizza
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{  //sizeIndex pra saber quem é o item 0,1,2... forEach = para cada um dos itens ele vai rodar uma função
            if(sizeIndex == 2){    // 2 é o tamanho da pizza G
                size.classList.add('selected');    //vai acessar o elemento(size), que vai acessar a lista de classe do elemento(classList), e vai adicionara class selected
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex'; //mostrando o modal
        setTimeout(()=> { c('.pizzaWindowArea').style.opacity = 1;},200);
    });
   
    //append pega o conteúdo que ja tem em pizza-area e adiciona mais um conteudo (adiciona outra,depois outra...)
    c('.pizza-area').append(pizzaItem);
});


// EVENTO DO MODAL (fechar)
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})

//BOTÃO MENOS
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
})
//BOTÃO MAIS
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

//TAMANHO DAS PIZZAS
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{  
    size.addEventListener('click', (e)=>{ // e = item que clicou
        c('.pizzaInfo--size.selected').classList.remove('selected'); // tira quem ta selecionado 
        size.classList.add('selected'); // seleciona o próprio item que esta clicando.
    })
});

//CARRINHO DE COMPRAS
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); //parseInt só para deixar todos inteiros 'transforma string em inteiro'
    
    let identifier = pizzaJson[modalKey].id + '@' + size;
    
    
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier
    });
    
    if(key > -1){
        cart[key].qt += modalQt;
    } else{
        //adicionando ao carrinho
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    
    uptadeCart()
    closeModal()
});

//EVENTO DE CLICK NO BOTÃO DE CARRINHO MOBILE (vai fazer o aside aparecer)
c('.menu-openner span').addEventListener('click', () => {
    if(cart.length > 0 ){
    c('aside').style.left = '0';
    }
});

//FECHAR ABA CARRINHO (para o aba carrinho aparacer é só zerar o left, para fazer ele sumir só coloar left=100vw)
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

//FUNÇÃO PARA ATUALIZAR O CARRINHO
function uptadeCart() {
    c('.menu-openner span').innerHTML = cart.length; // PARA ATUALIZAR NO MOBILE A ANT DE INTEM NO CARRINHO



    if(cart.length > 0){
        c('aside').classList.add('show'); // show= aparecer
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id; // OU pizzaJson.find((item)=>item.id == cart[i].id);
                });
            subtotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            
           
            cartItem.querySelector('img').src = pizzaItem.img; //foto pizza
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;  //nome
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; // quantidade
           
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
               if(cart[i].qt > 1){
                cart[i].qt--;  
               } else{
                cart.splice(i, 1); //O método splice() altera o conteúdo de uma lista, adicionando novos elementos enquanto remove elementos antigos.
               }                   // splice remove o item [i], em 1 quantidade
               uptadeCart();
            });
                
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                uptadeCart();
            });
                


            c('.cart').append(cartItem);
         
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}