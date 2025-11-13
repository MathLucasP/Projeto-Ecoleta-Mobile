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
    
    $pdo = $conn;
    // Recebe os dados JSON
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    
    if (!$dados) {
        throw new Exception('Dados inválidos');
    }
    
    // Valida dados obrigatórios
    $camposObrigatorios = ['email', 'senha', 'nome', 'cpf', 'telefone', 'dataNasc', 'endereco'];
    foreach ($camposObrigatorios as $campo) {
        if (empty($dados[$campo]) && $campo !== 'endereco') {
            throw new Exception("Campo obrigatório ausente: $campo");
        }
    }
    
    // Valida endereço
    if (empty($dados['endereco']['cep']) || empty($dados['endereco']['rua']) || 
        empty($dados['endereco']['numero']) || empty($dados['endereco']['bairro']) || 
        empty($dados['endereco']['cidade']) || empty($dados['endereco']['estado'])) {
        throw new Exception('Dados de endereço incompletos');
    }
    
    // Inicia transação
    $pdo->beginTransaction();
    
    // 1. Verifica se email já existe
    $stmt = $pdo->prepare("SELECT id FROM geradores WHERE email = ?");
    $stmt->execute([$dados['email']]);
    if ($stmt->fetch()) {
        throw new Exception('Email já cadastrado');
    }
    
    // 2. Verifica se CPF já existe
    $cpfLimpo = preg_replace('/[^0-9]/', '', $dados['cpf']);
    $stmt = $pdo->prepare("SELECT id FROM geradores WHERE cpf = ?");
    $stmt->execute([$cpfLimpo]);
    if ($stmt->fetch()) {
        throw new Exception('CPF já cadastrado');
    }
    
    // 3. Insere endereço
    $stmt = $pdo->prepare("
        INSERT INTO enderecos (rua, numero, complemento, bairro, cidade, estado, cep) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $dados['endereco']['rua'],
        $dados['endereco']['numero'],
        $dados['endereco']['complemento'] ?? '',
        $dados['endereco']['bairro'],
        $dados['endereco']['cidade'],
        $dados['endereco']['estado'],
        preg_replace('/[^0-9]/', '', $dados['endereco']['cep'])
    ]);
    
    $idEndereco = $pdo->lastInsertId();
    
    // 4. Hash da senha
    $senhaHash = password_hash($dados['senha'], PASSWORD_DEFAULT);
    
    // 5. Prepara dados do gerador
    $telefoneLimpo = preg_replace('/[^0-9]/', '', $dados['telefone']);
    $genero = isset($dados['genero']) && in_array($dados['genero'], ['M', 'F', 'O']) 
              ? $dados['genero'] 
              : '';
    
    // 6. Processa foto se houver
    $fotoNome = null;
    if (!empty($dados['foto'])) {
        // Remove o prefixo data:image
        $fotoData = $dados['foto'];
        if (preg_match('/^data:image\/(jpeg|png);base64,(.+)$/', $fotoData, $matches)) {
            $extensao = $matches[1] === 'jpeg' ? 'jpg' : 'png';
            $fotoBase64 = $matches[2];
            
            // Cria diretório se não existir
            $uploadDir = __DIR__ . '/uploads/perfil/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Gera nome único
            $fotoNome = uniqid() . '.' . $extensao;
            $caminhoCompleto = $uploadDir . $fotoNome;
            
            // Salva arquivo
            file_put_contents($caminhoCompleto, base64_decode($fotoBase64));
        }
    }
    
    // 7. Insere gerador
    $stmt = $pdo->prepare("
        INSERT INTO geradores 
        (email, senha, nome_completo, cpf, telefone, data_nasc, genero, foto_perfil, id_endereco, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    ");
    
    $stmt->execute([
        $dados['email'],
        $senhaHash,
        $dados['nome'],
        $cpfLimpo,
        $telefoneLimpo,
        $dados['dataNasc'],
        $genero,
        $fotoNome,
        $idEndereco
    ]);
    
    $idGerador = $pdo->lastInsertId();
    
    // 8. Cria configurações padrão do usuário
    $stmt = $pdo->prepare("
        INSERT INTO configuracoes_usuario (id_gerador) 
        VALUES (?)
    ");
    $stmt->execute([$idGerador]);
    
    // Commit da transação
    $pdo->commit();
    
    // Retorna sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Cadastro realizado com sucesso!',
        'data' => [
            'id' => $idGerador,
            'email' => $dados['email'],
            'nome' => $dados['nome']
        ]
    ]);
    
} catch (PDOException $e) {
    // Rollback em caso de erro
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    // Rollback em caso de erro
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
