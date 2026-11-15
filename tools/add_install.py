"""Makes houseforlearning.com installable as an app (phone, tablet, Windows, Mac). Idempotent.
Use: python3 -I tools/add_install.py site"""
import os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'site')
subprocess.check_call([sys.executable, '-I', os.path.join(here, 'install_kit.py'), '--root', root, '--template', '404.html',
    '--scope', '', '--name', 'House for Learning', '--short', 'House for Learning',
    '--desc', 'Courses, career pathways and learning for individuals, teams and institutions.',
    '--theme', '#2b5d8a', '--icon', 'assets/brand/favicon-512.png', '--icon-mode', 'logo',
    '--origin', 'https://houseforlearning.com', '--lang', 'en-GB'])
