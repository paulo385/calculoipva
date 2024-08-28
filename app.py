from flask import Flask, request, jsonify
import logging

app = Flask(__name__)

# Configuração do log
logging.basicConfig(filename='access_log.log', level=logging.INFO, 
                    format='%(asctime)s %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

@app.route('/log_access', methods=['POST'])
def log_access():
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    ip = request.remote_addr
    referer = request.headers.get('Referer', 'N/A')
    user_agent = request.headers.get('User-Agent', 'N/A')
    
    log_entry = f"IP: {ip}, Referer: {referer}, User-Agent: {user_agent}, Data: {data}"
    logging.info(log_entry)
    
    return jsonify({'status': 'success'}), 200

if __name__ == '__main__':
    app.run(debug=True)