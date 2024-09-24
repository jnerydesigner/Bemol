![Bemol Digital Banner](https://raw.githubusercontent.com/jnerydesigner/challenge-bemol/main/assets/bemoldigital-banner.png)

# Desafio Bemol Digital

## Vamos Colocar a aplicação no ar, mas primeiro tenho que te passa alguns detalhes:
1. Não consegui concluir a parte do Kubernetes, primeiro que meu computador é um i3 com 8gb de memória, gargalou e desligava toda hora o notebook.
2. Fiz um docker compose, testei antes de enviar.
3. Irá ter uma instrução de uso do ethereal email, só para testar o envio de email.
4. Uma parte de chor, estou desempregado, por isso não comprei uma memória melhor para o desafio.
5. Vou ficar devendo alguns itens, pois não deu tempo de passar por todos os cases.

## Agora Vamos de instruções:
1. Usaremos o Ethereal para solução de envio de emails.

    1.1 - https://ethereal.email/create
2. Não deixe de trocar o .env e as variaveis, pois o docker está usando so files .env, irei passar as variaveis de ambiente em um zip so para substituir.
3. Vode pode mudar as variáveis até para entender o funcionamento

## comandos para rodar a stack (não fiz em formato de stack)
```
docker-compose up -d
exemplo de criação de usuário:

{
	"name": "Jane Doe",
	"email": "jane.doe@email.com",
	"password": "12345678"
}


Exemplode criação de Order:

{
	"userId": "14390422-0aeb-4318-9d8c-908f997da560",
	"products": [
		{
			"productId": "dfe88522-044f-4d78-9aa5-def92fd52267",
			"quantity": 2
		},
		{
			"productId": "7908009c-8e3f-46b5-bdaa-253d17601bcb",
			"quantity": 5
		},
			{
			"productId": "9eba84b2-c3d2-4c5d-8163-355d7c609742",
			"quantity": 4
		}
	]
}

Quando quiser criar um inventário

{
	"productId": "7908009c-8e3f-46b5-bdaa-253d17601bcb",
	"quantity": 200
}
Atualiza

{
	"quantity": 300
}


Criação de um produto
{
	"name": "Boneca da barbie Nova",
	"price" : 350	
}
```




## Criação da Solução em c4model

1. **Context Diagram**

* **Clientes**: Interagem com o Sistema de pedidos através de uma API HTTP/REST para criar, consultar e cancelar pedidos.

* **Gerenciador de Mensageria (RabbitMQ)**: Responsável pela orquestração de eventos e comunicação entre os serviços.

* **Sistemas Legados**: Conectados ao sistema via adaptadores ou portas (Opção por Ports and Adapters) para futura integração.

* **Sistema de Processamento de Pedidos**: A aplicação em si, que orquestra os pedidos de acordo com os eventos recebidos, construida em NestJS.

![Context Diagram](https://raw.githubusercontent.com/jnerydesigner/challenge-bemol/main/assets/diagrams/out/n1-context/Context.png)



2. **Container Diagram**

* **API Gateway em NestJS**

    1 - Recebe requisições dos clientes.

    2 - Gera eventos de criação, atualização e consulta de pedidos.

    3 - Publica mensagens no gerenciador de mensageria.

* **Order Service (Processamento de Pedidos)** 

    1 - Container que processa os eventos relacionados a pedidos.

    2 - Escalável dinamicamente com base na demanda de mensagens no gerenciador de mensageria.

    3 - Implementado como um microsserviço autônomo que consome eventos do gerenciador de mensagens.

* **Payment Service (Processamento de Pagamentos)** 

    1 - Container que gerencia a aprovação e rejeição de pagamentos.

    2 - Interage com gateways de pagamento externos e publica eventos de pagamento no gerenciador de mensageria.

* **Inventory Service (Gestão de Inventário)** 

    1 - Conteiner responsável pela reserva e liberação de estoque.


    2 - Assina os eventos de novos pedidos e atualiza o inventário em tempo real.

* **Message Broker (Gerenciador de Mensagens)** 

    1 - Centraliza a troca de mensagens entre os serviços (RabbitMQ).


    2 - Todos os serviços publicam e consomem eventos através deste broker.

* **Database (PostgreSQL)** 

    1 - Armazena o estado dos pedidos, inventário e transações.


    2 - Cada microsserviço pode ter sua própria base de dados para garantir a independência.

* **Auto-Scaling Service (Kubernetes, Docker Swarm)** 

    1 - Gerencia a escalabilidade dinâmica dos containers com base na quantidade de eventos ou métricas de performance (CPU, memória).


![Container Diagram](https://raw.githubusercontent.com/jnerydesigner/challenge-bemol/main/assets/diagrams/out/n2-container/Container%20n2.png)


3. **Component Diagram**
    1 - **Event Listener**: Componente que ouve os eventos de "new-order" do Message Broker

    2 - **Order Processor**: Processa as Informações do Pedido, validando o estoque e gerando eventos para pagamento.

    3 - **Event Publisher**: Publica os eventos de confirmação ou falha de processamento para os outros serviços (Payment Service e Inventory Service)


![Container Diagram](https://raw.githubusercontent.com/jnerydesigner/challenge-bemol/main/assets/diagrams/out/n3-component/Component%20n3.png)

4. **Code Order Diagram**

* OrderController (controlador HTTP)

* OrderEventHandler (para consumir os eventos do gerenciador de mensageria)

* OrderRepository (para persistência de dados)

* OrderProcessor (lógica de negócios)


![Code Order Diagram](https://raw.githubusercontent.com/jnerydesigner/challenge-bemol/main/assets/diagrams/out/n4-code-order/Code%20n4.png)

4. **Code Payment Diagram**

