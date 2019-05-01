import wedapp2
app = wedapp.WSGIApplication()

class RedirectToHome(webapp.RequestHandler):
    def get(self, path):
        self.redirect('/layouts/404.html')

routes = [
    RedirectRoute('/<path:.*', RedirectToHome),
]

for r in routes:
    app.router.add(r)
