const { request } = require('express');
const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());


//credenciais DB
var faunadb = require('faunadb'),
q = faunadb.query;
var serverClient = new faunadb.Client({ secret: 'fnAExgCAMGACUeL0NW5U7fn2oAKNq3_4yLJWQgP8' });

/**
 * Realizar login
 */
app.get('/login', async function(req, res){
  let query = await serverClient.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index("login"), req.body.user)
      ),
      q.Lambda(
        "person",
        q.Get(q.Var("person"))
      )
    )
  )
  var dados = query.data
  if(dados.length === 0){
    res.status(200).json({Erro: "usuario ou senha invalido 123" })
  }
  dados.forEach(element => {
    if(element.data.User == req.body.user){
      var auth = bcrypt.compareSync(req.body.password, element.data.Pass);
      if(auth == true){
        const id = element.data.User; //esse id viria do banco de dados
        const token = jwt.sign({ id }, element.data.Name, {
          expiresIn: 3000 // expires in 5min
        });
        res.status(200).json({token_login: token, auth: auth, data: element.data })
      }else{
        res.status(200).json({Erro: "usuario ou senha invalido" })
      }
    }
  }
  );
})

/**
 * Cadastrar usuario no banco de dados
 */
app.post('/create-login', async function(req, res){
  let query = await serverClient.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index("login"), req.body.user)
      ),
      q.Lambda(
        "person",
        q.Get(q.Var("person"))
      )
    )
  )
  var dados = query.data
  if(dados.length === 0){
    var tokenapi = req.body.user
    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(tokenapi, salt);

    const saltpass = bcrypt.genSaltSync(10);
    const passworscript = bcrypt.hashSync(req.body.password, saltpass);


    const date = new Date();
      serverClient.query(
            q.Create(
            q.Collection('Authentication'),
            { data: { 
                Name: req.body.name,
                User: req.body.user,
                Pass: passworscript,
                Email: req.body.email,
                Cpf: req.body.cpf,
                AcessTokenApi: hash,
                Birth: req.body.birth,
                CreateData: date.toISOString()
              } },
            )
      )
      .then(function(){
        res.status(200).json({data: req.body, status: 200, message: "Usuario cadastrado com sucesso"});
      }).catch(function(){
          res.status(422).json({status: 422, message: "Erro ao cadastrar os dados no banco"});
      })
  }else{
    res.status(200).json({Erro: "Usuario ja Existente" })
  }
})





/*
const { request } = require('express');
const express = require('express');
const { engine } = require('express-handlebars');
const axios = require('axios');
const app = express();
var FormData = require('form-data');
app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main" }));

app.set('view engine', 'handlebars');
app.set("views");




//Rota gera o tokem do cliente e envia como parametro para instalar o app
app.get('/install', function (req, res) {
    const dados = req.query;
    const code_shop = req.query.code;
    //console.log(code_shop);
    if (code_shop) {
        const data = new FormData();
        data.append('client_id', '5476');
        data.append('client_secret', 'rI9X1W8XwQdng0aHf9ZpKoPtYEh5ZPkL026OfKBsP4z6TkQv');
        data.append('grant_type', 'authorization_code');
        data.append('code', code_shop);
        const config = {
            method: 'post',
            url: 'https://www.tiendanube.com/apps/authorize/token',
            headers: {
                'Cookie': '_WORKER_NODE=core-inst-v2-10-1-202-62; ab=olark%3D1; site_session=8522a56faf19167c7644aff04a6ef229da363eaf%7EAtMQUXYwxNWpNrJ2KFSTVBSEfkI018UbrZ4rn9fs',
                ...data.getHeaders()
            },
            data: data
        };
        axios(config)
          .then(function (response) {
            // req.app.set('token', response.data)
            const info = response.data;
            console.log(info);
            res.render('install_app/install', { info });
          })
          .catch(function (error) {
            //console.log(error);
            res.render('home');
          });
    } 
    else {
      res.render('home', { dados });
    }
  });

app.get('/',()=>{

    var data = JSON.stringify({
        "user": "warley",
        "pass": "123",
      });
      
      var config = {
        method: 'get',
        url: 'http://localhost:3000/api/auth/',
        headers: { 
          'authentication': 'efafc26992df3feac146858e20205a3af2d09a3e', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });


})
*/
app.listen(8080);





/*
criptografar a senha 

  const password = 'P@ssword123@';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
fim criptografar a senha 
*/