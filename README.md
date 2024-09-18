![Bemol Digital Banner](https://raw.githubusercontent.com/jnerydesigner/challenge-bemol/main/assets/bemoldigital-banner.png)

# Desafio Bemol Digital

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


![Component Diagram](https://raw.githubusercontent.com/jnerydesigner/challenge-bemol/main/assets/diagrams/out/n3-component/Component%20n3.png)

4. **Code Diagram**

* OrderController (controlador HTTP)

* OrderEventHandler (para consumir os eventos do gerenciador de mensageria)

* OrderRepository (para persistência de dados)

* OrderProcessor (lógica de negócios)
