"""Recovered KNEURA backend source bridge.

The original Python 3.14 source was unavailable. This bridge executes the
unchanged, hash-verified compiled module from backend/__pycache__ so its route
and workflow behavior is restored without rewriting or modifying the bytecode.
"""
from ._pyc_loader import load_compiled
load_compiled(__name__, 'app.cpython-314.pyc')

# Extend the recovered application without modifying its protected bytecode.
import sys as _sys
from .patient_cases import install as _install_patient_cases
_install_patient_cases(_sys.modules[__name__])
