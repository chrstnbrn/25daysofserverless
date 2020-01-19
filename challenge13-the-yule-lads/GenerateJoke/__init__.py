import azure.functions as func
import tempfile
import os
import urllib.request
from textgenrnn import textgenrnn

def main(req: func.HttpRequest) -> func.HttpResponse:
    model_url = os.environ["JOKE_MODEL_URL"]
    model_path = write_to_temp_file(model_url, 'jokes.hdf5')
    temperature_param = req.params.get('temperature')
    temperature = 0.5 if temperature_param is None else float(temperature_param)
    joke = generate_joke(model_path, temperature)
    return func.HttpResponse(joke)

def write_to_temp_file(url: str, file_name: str) -> str:
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file_name)
    urllib.request.urlretrieve(url, temp_path)
    return temp_path

def generate_joke(model_path: str, temperature: float) -> str:
    textgen = textgenrnn(model_path)
    return textgen.generate(return_as_list=True, temperature=temperature)[0]
