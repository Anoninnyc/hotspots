export default function(app) {
  app.get('/', (req, res) => {
    console.log('redirected back');
    res.render('index');
  });
}
