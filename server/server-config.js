import bodyParser from 'body-parser';
import path from 'path';


const webpackCompiler = webpack(webpackConfig);

export default function(app, express) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '/../build')));
  app.use(express.static(path.join(__dirname, '/../node_modules')));
}
