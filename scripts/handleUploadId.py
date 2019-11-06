import sys
import onfido
import datetime
from onfido.rest import ApiException

configuration = onfido.Configuration()
configuration.api_key['Authorization'] = 'token=' + '<YOUR_API_TOKEN>'
configuration.api_key_prefix['Authorization'] = 'Token'

api = onfido.DefaultApi(onfido.ApiClient(configuration))

applicant_id = sys.argv[1]

sample_file = sys.argv[2]

document = api.upload_document(applicant_id, 'driving_licence', sample_file, side='front')