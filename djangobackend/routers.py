from rest_framework import routers
from api.views import UserView

router = routers.SimpleRouter()
router.register(r'siteusers', UserView, basename="siteusers")
urlpatterns = router.urls