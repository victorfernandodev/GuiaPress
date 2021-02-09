function confirmarDelecao(event, form){
    event.preventDefault();
    var decision = confirm("Você quer deletar esta categoria?");
    if(decision){
        form.submit();
    }
}