//Chiamata Ajax per richiamre i valori dell'API

// Gennaio: tot amount
// Febbraio:  tot amount
// Marzo:  tot amount
// Aprile:  tot amount
// Maggio:  tot amount
// Giugno:  tot amount
// Luglio:  tot amount
// Agosto:  tot amount
// Settembre:  tot amount
// Ottobre:  tot amount
// Novembre:  tot amount
// Dicembre:  tot amount

$.ajax({

        url: 'http://157.230.17.132:4014/sales',
        method: 'GET',
        success: function(data){
            var meseSomma = {
                'gennaio': 0,
                'febbraio': 0,
                'marzo': 0,
                'aprile': 0,
                'maggio': 0,
                'giugno': 0,
                'luglio': 0,
                'agosto': 0,
                'settembre': 0,
                'ottobre': 0,
                'novembre': 0,
                'dicembre': 0
            };
            var dati = data; // ho i miei dati
            for (var i = 0; i < dati.length; i++) {
                var dato = dati[i] //estrapolo i singoli dati
                // console.log(dato.id);
                // console.log(dato.salesman);
                // console.log(dato.amount); //Mi interessa l'ammontare delle somme
                // console.log(dato.date); //Mi interessa la data, e troverò il mese
                var mese = dato.date; // Mi creo la variabile che estrapolo la data
                var thisMonth = moment(mese, 'DD/MM/YYYY').format("MMMM"); //Trovo il mese che mi servirà per la somma
                //console.log(thisMonth);
                if (meseSomma[thisMonth] === undefined) { //Il colore lo do al mio valore vuoto
                    meseSomma[thisMonth] = 0; //Se non essite, cioè se è uguale a 0 gli do 0
                }
                meseSomma[thisMonth] += dato.amount;
                console.log(meseSomma[thisMonth]);

            }

                var labelsChart = [];
                var dataChart = [];

                for (var key in meseSomma) {
                    labelsChart.push(key);
                    dataChart.push(meseSomma[key])
                }
                laMiaSomma(labelsChart, dataChart)
        },
        error: function(){
            alert('errore')
        }
    });


function laMiaSomma(labels, data){
    var ctx = $('#grafico');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                label: 'Database incassi annuali 2018',
                backgroundColor: 'orange',
                borderColor: 'orange',
                data: data
            }]
        },
    });
};
