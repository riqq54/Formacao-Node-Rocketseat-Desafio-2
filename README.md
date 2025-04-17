# Desafio 2

## RF

- [X] Deve ser possível criar um usuário
- [X] O usuário deve poder registrar uma refeição feita, com as seguintes informações:

    *As refeições devem ser relacionadas ao usuário.*

    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta

- [X] O usuário deve poder editar uma refeição registrada, podendo alterar todos os dados acima
- [X] O usuário deve poder apagar uma refeição
- [X] O usuário deve poder listar todas as suas refeições
- [X] O usuário deve poder visualizar uma única refeição
- [X] O usuário deve poder obter um resumo de suas métricas
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta

## RN

- [X] O usuário só pode visualizar, editar e apagar as refeições as quais ele criou
- [X] Deve ser possível identificar o usuário entre as requisições



# Observações:

Aprendi bastante nesse desafio, mas queria destacar o quanto estava apanhando para criar a lógica das Streaks do resumo!

Descobri o método *reduce* dos arrays, que à primeira vista é um pouco assustador mas pesquisando bastante consegui entender sua funcionalidade!

A primeiro momento essa foi minha tentativa de resolução:

```javascript
    let onDietStreak: number = 0
    let streaks: number[] = [] 

    meals.forEach((meal) => {
        if(meal.on_diet){
            onDietStreak++
        }else{
            streaks.push(onDietStreak)
            onDietStreak = 0
        }
    })

    const bestOnDietStreak = Math.max(...streaks)
```

Infelizmente essa resolução funcionava apenas se a última refeição inserida não estivesse dentro da dieta, pois dentro do else o método *push* era ativado e a informação da streak era "atualizada".

Depois de quebrar bastante a cabeça sobre como poderia acompanhar o estado dessas variáveis, notei que na resolução era usado o método *reduce* dos arrays que nunca havia utilizado, mas como prefiro entender do que só usar o CTRL + C e CTRL + V, fiz minhas pesquisas e vou deixar registrado aqui como forma de anotação.

Assim como o nome diz, esse método possibilita a redução dos elementos de um array para poucos ou somente 1 elemento, podendo ser um objeto, string, números, etc. 

Para simplificar, vamos levar em consideração uma situação na qual precisamos somar todos os números de um array. Seguindo a mesma abordagem da minha tentativa anterior, podemos resolver assim:

```javascript
    const numeros = [1,2,3,5]
    let resultado = 0

    numeros.forEach(numero => {
        resultado += numero
    })
```

Mas também podemos resolver utilizando o reduce:

```javascript
    const numeros = [1,2,3,5]

    const resultado = numeros.reduce((acumulador, valorAtual) => {
        return acumulador + valorAtual
    }, 0)
```

Como primeiro parâmetro, o reduce recebe uma função de callback com dois parâmetros: o acumulador e valorAtual. O segundo parâmetro do reduce indica qual será o valor inicial do acumulador, neste caso 0. O valorAtual é o elemento do array que está passando pela iteração!

Funciona como se fosse um loop, cada vez que ele faz uma iteração pelo array ele executa a função, porém o resultado dessa função é armazenado no acumulador, que podemos utilizar na próxima iteração e assim por diante.

Antes de começar, definimos o acumulador valendo 0, então:

- Primeira iteração:
```javascript
    acumulador = 0, valorAtual = 1 --> 1 //Este valor será assumido pelo acumulador na próxima iteração...
```
- Segunda iteração:
```
    acumulador = 1, valorAtual = 2 --> 3 //E assim por diante!
```

Diante disso, montei resolução do resumo:

```javascript
    const meals = await knex('meals').where('user_id', user_id).orderBy('had_at', 'asc')

    const {bestStreak, currentStreak} = meals.reduce((accumulator, currentValue)=> {
        
        if(currentValue.on_diet){
            accumulator.currentStreak += 1
        } else {
            accumulator.currentStreak = 0
        }

        if(accumulator.currentStreak > accumulator.bestStreak){
            accumulator.bestStreak = accumulator.currentStreak
        }

        return accumulator

    }, { bestStreak: 0, currentStreak: 0 })
```

Como disse anteriormente, os elementos podem ser objetos como é o caso acima, isso também vale para o segundo parâmetro do método! Podemos definir valores iniciais desta forma, criando propriedades para o objeto *accumulator*.

Primeiro, validamos se a refeição estava dentro da dieta e adicionamos 1 à propriedade *currentStreak*, caso contrário, precisamos zerar a *currentStreak*, pois a sequência foi quebrada. Em seguida, validamos se a *currentStreak* é maior que a *bestStreak* se for, se tornará a melhor!

Dessa forma, conseguimos manter o estado de ambas as variáveis!
