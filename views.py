import json
import os
import re

from django.shortcuts import render_to_response, render
from django.http import HttpResponse, HttpResponseBadRequest,\
     HttpResponseRedirect
from django.conf import settings
from django.template import RequestContext


def load_json(name):
    cwd = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(cwd, 'protected_data', 'new_data')
    file_path = os.path.join(path, name + '.json')
    with open(file_path, 'r') as f:
        json = f.read()
    return json


def context_processor(request):
    zones = json.loads(load_json('zones'))
    lgas = [lga
        for state in zones.values()
        for lgas in state.values()
        for lga in lgas.items()]
    lgas.sort(key=lambda x: x[0])
    return {'lgas' : lgas}


def index(request):
    return render(request, 'index.html')


def download(request):
    return render(request, 'data_download.html')


def about(request):
    return render(request, 'about.html')


def dashboard(request):
    zones = json.loads(load_json('zones'))
    sorted_zones = []
    for zone, states in zones.items():
        sorted_states = []
        for state, lgas in states.items():
            lgas = sorted(lgas.items(), key=lambda x: x[0])
            sorted_states.append((state, lgas))
        sorted_states.sort(key=lambda x: x[0])
        sorted_zones.append((zone, sorted_states))
    sorted_zones.sort(key=lambda x: x[0])

    return render(request, 'dashboard.html', {
        'zones': json.dumps(sorted_zones),
        'indicators': load_json('indicators'),
        'lga_overview': load_json('lga_overview'),
        'lga_sectors': load_json('lga_sectors')
    })


