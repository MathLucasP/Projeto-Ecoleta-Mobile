<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Se for preflight request, retorna apenas headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Apenas aceita POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit();
}

// Configuração do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ecoleta";

try {
    // Conecta ao banco
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Recebe os dados JSON
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    
    if (!$dados || empty($dados['email']) || empty($dados['senha'])) {
        throw new Exception('Email e senha são obrigatórios');
    }
    
    $email = $dados['email'];
    $senha = $dados['senha'];
    
    // Busca o gerador pelo email
    $stmt = $conn->prepare("
        SELECT id, email, senha, nome_completo, foto_perfil, status 
        FROM geradores 
        WHERE email = ?
    ");
    $stmt->execute([$email]);
    $gerador = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$gerador) {
        throw new Exception('Email ou senha incorretos');
    }
    
    // Verifica a senha
    if (!password_verify($senha, $gerador['senha'])) {
        throw new Exception('Email ou senha incorretos');
    }
    
    // Verifica o status do gerador (deve estar aprovado)
    if ($gerador['status'] !== 'ativo' && $gerador['status'] !== 'pendente') {
        throw new Exception('Sua conta foi desativada. Entre em contato com o suporte.');
    }
    
    // Login bem-sucedido
    echo json_encode([
        'success' => true,
        'message' => 'Login realizado com sucesso!',
        'data' => [
            'id' => $gerador['id'],
            'email' => $gerador['email'],
            'nome' => $gerador['nome_completo'],
            'foto' => $gerador['foto_perfil'],
            'status' => $gerador['status']
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
