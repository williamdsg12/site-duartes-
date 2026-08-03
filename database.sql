-- =============================================================================
-- SQL SCHEMA AND INITIAL SEED DATA FOR DUARTE'S LIMPEZAS SITE
-- Compatible with PostgreSQL & MySQL (with minor type adjustments if needed)
-- =============================================================================

-- Enable UUID extension if PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. TABLE: User (Usuários do Painel Administrativo)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "User" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. TABLE: SiteInfo (Informações da Empresa e Contato)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SiteInfo" (
    "id" VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    "companyName" VARCHAR(255) NOT NULL DEFAULT 'Duarte''s Limpezas, Desentupidora e Manutenções',
    "slogan" VARCHAR(255) NOT NULL DEFAULT 'Soluções completas em limpeza, desentupimento e manutenção',
    "description" TEXT NOT NULL,
    "aboutText" TEXT NOT NULL,
    "phoneDisplay" VARCHAR(50) NOT NULL DEFAULT '(44) 99706-9677',
    "phoneRaw" VARCHAR(50) NOT NULL DEFAULT '5544997069677',
    "email" VARCHAR(255) NOT NULL DEFAULT 'duarteslimpezacaixadeagua@gmail.com',
    "address" VARCHAR(255) NOT NULL DEFAULT 'Av. Paulino Rech, 203',
    "city" VARCHAR(100) NOT NULL DEFAULT 'Paranavaí - PR',
    "cep" VARCHAR(20) NOT NULL DEFAULT 'CEP 87702-430',
    "hours" VARCHAR(100) NOT NULL DEFAULT 'Segunda a Sexta, 08h às 18h',
    "region" VARCHAR(255) NOT NULL DEFAULT 'Paranavaí e toda Região Noroeste do Paraná',
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. TABLE: HeroBanner (Configurações da Seção Principal do Site)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "HeroBanner" (
    "id" VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    "badgeText" VARCHAR(255) NOT NULL DEFAULT 'Há 5 anos em Paranavaí e Região',
    "titleLine1" VARCHAR(255) NOT NULL DEFAULT 'Duarte''s Limpezas,',
    "titleLine2" VARCHAR(255) NOT NULL DEFAULT 'Desentupidora e',
    "titleLine3" VARCHAR(255) NOT NULL DEFAULT 'Manutenções',
    "subtitle" TEXT NOT NULL,
    "videoUrl" VARCHAR(500) NOT NULL DEFAULT '/assets/hero-video.mp4',
    "posterUrl" VARCHAR(500) NOT NULL DEFAULT '/assets/gallery/g4.jpg',
    "button1Text" VARCHAR(100) NOT NULL DEFAULT 'Solicitar Orçamento',
    "button1Link" TEXT NOT NULL,
    "button2Text" VARCHAR(100) NOT NULL DEFAULT 'Falar no WhatsApp',
    "button2Link" TEXT NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. TABLE: ServiceItem (Serviços Oferecidos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ServiceItem" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(100) NOT NULL DEFAULT 'Wrench',
    "buttonText" VARCHAR(100) NOT NULL DEFAULT 'Solicitar orçamento',
    "buttonLink" TEXT,
    "order" INT NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 5. TABLE: GalleryMedia (Galeria de Fotos e Projetos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "GalleryMedia" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255),
    "src" VARCHAR(500) NOT NULL,
    "fullSrc" VARCHAR(500),
    "alt" VARCHAR(255) NOT NULL,
    "permalink" TEXT,
    "order" INT NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 6. TABLE: TestimonialItem (Depoimentos e Avaliações de Clientes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "TestimonialItem" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INT NOT NULL DEFAULT 5,
    "photo" VARCHAR(500),
    "order" INT NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 7. TABLE: FaqItem (Perguntas Frequentes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "FaqItem" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INT NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 8. TABLE: ServiceAreaConfig (Configuração de Região Atendida)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ServiceAreaConfig" (
    "id" VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    "badgeText" VARCHAR(255) NOT NULL DEFAULT 'Área de Atendimento',
    "title" VARCHAR(255) NOT NULL DEFAULT 'Atendemos Paranavaí e toda a Região Noroeste do Paraná',
    "description" TEXT NOT NULL,
    "citiesJson" TEXT NOT NULL,
    "mapUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. TABLE: SocialConfig (Links de Redes Sociais)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SocialConfig" (
    "id" VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    "instagram" VARCHAR(500) DEFAULT 'https://instagram.com/duarteslimpezacaixadeagua',
    "instaToken" TEXT DEFAULT '',
    "facebook" VARCHAR(500) DEFAULT 'https://facebook.com/duarteslimpezacaixadeagua',
    "whatsapp" VARCHAR(500) DEFAULT 'https://wa.me/5544997069677',
    "youtube" VARCHAR(500) DEFAULT '',
    "tiktok" VARCHAR(500) DEFAULT '',
    "linkedin" VARCHAR(500) DEFAULT '',
    "activeInsta" BOOLEAN NOT NULL DEFAULT TRUE,
    "activeFb" BOOLEAN NOT NULL DEFAULT TRUE,
    "activeWa" BOOLEAN NOT NULL DEFAULT TRUE,
    "activeYt" BOOLEAN NOT NULL DEFAULT FALSE,
    "activeTt" BOOLEAN NOT NULL DEFAULT FALSE,
    "activeLi" BOOLEAN NOT NULL DEFAULT FALSE,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 10. TABLE: SeoConfig (Configurações de SEO e Meta Tags)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SeoConfig" (
    "id" VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    "metaTitle" VARCHAR(255) NOT NULL DEFAULT 'Duarte''s Limpezas | Desentupidora em Paranavaí',
    "metaDescription" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "ogTitle" VARCHAR(255) NOT NULL DEFAULT 'Duarte''s Limpezas | Desentupidora em Paranavaí',
    "ogDescription" TEXT NOT NULL,
    "ogImage" VARCHAR(500) NOT NULL DEFAULT '/assets/logo-hero.png',
    "twitterCard" VARCHAR(100) NOT NULL DEFAULT 'summary_large_image',
    "canonicalUrl" VARCHAR(500) NOT NULL DEFAULT 'https://manutencao-duartes.preview.emergentagent.com/',
    "robots" VARCHAR(100) NOT NULL DEFAULT 'index, follow',
    "schemaLd" TEXT NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 11. TABLE: SiteSettings (Aparência, Cores e Logotipos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    "logoUrl" VARCHAR(500) NOT NULL DEFAULT '/assets/logo.png',
    "logoHeroUrl" VARCHAR(500) NOT NULL DEFAULT '/assets/logo-hero.png',
    "faviconUrl" VARCHAR(500) NOT NULL DEFAULT '/assets/logo.png',
    "primaryColor" VARCHAR(50) NOT NULL DEFAULT '#0B3C5D',
    "accentColor" VARCHAR(50) NOT NULL DEFAULT '#FFC107',
    "footerText" TEXT NOT NULL DEFAULT 'Há 5 anos oferecendo soluções completas em limpeza, desentupimento e manutenção.',
    "copyrightText" TEXT NOT NULL DEFAULT '© 2026 Duarte''s Limpezas, Desentupidora e Manutenções. Todos os direitos reservados.',
    "waButtonText" VARCHAR(100) NOT NULL DEFAULT 'Orçamento Rápido',
    "callButtonText" VARCHAR(100) NOT NULL DEFAULT 'Ligar Agora',
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 12. TABLE: AuditLog (Logs de Auditoria e Ações dos Usuários)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    "action" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(36),
    "userEmail" VARCHAR(255),
    "ip" VARCHAR(50) NOT NULL DEFAULT '127.0.0.1',
    "details" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_log_user FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

-- =============================================================================
-- INITIAL SEED DATA (DADOS INICIAIS DO SITE)
-- =============================================================================

-- 1. Usuário Administrador Padrão (Senha padrão: duartes1234)
INSERT INTO "User" ("id", "name", "email", "passwordHash", "role") 
VALUES (
    'usr-admin-01', 
    'Administrador Duarte''s', 
    'admin@duartes.com.br', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'ADMIN'
) ON CONFLICT ("email") DO NOTHING;

-- 2. Informações do Site
INSERT INTO "SiteInfo" ("id", "companyName", "slogan", "description", "aboutText", "phoneDisplay", "phoneRaw", "email", "address", "city", "cep", "hours", "region")
VALUES (
    'default',
    'Duarte''s Limpezas, Desentupidora e Manutenções',
    'Soluções completas em limpeza, desentupimento e manutenção',
    'Empresa especializada em limpeza de caixa d''água, desentupimento, hidrojateamento, limpeza de fossa, caixa de gordura, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste do Paraná.',
    'A Duarte''s Limpezas, Desentupidora e Manutenções atua há 5 anos oferecendo serviços especializados para residências, empresas e condomínios. Nosso compromisso é entregar qualidade, segurança e agilidade em cada atendimento, utilizando equipamentos modernos e mão de obra qualificada.',
    '(44) 99706-9677',
    '5544997069677',
    'duarteslimpezacaixadeagua@gmail.com',
    'Av. Paulino Rech, 203',
    'Paranavaí - PR',
    'CEP 87702-430',
    'Segunda a Sexta, 08h às 18h',
    'Paranavaí e toda Região Noroeste do Paraná'
) ON CONFLICT ("id") DO NOTHING;

-- 3. Hero Banner
INSERT INTO "HeroBanner" ("id", "badgeText", "titleLine1", "titleLine2", "titleLine3", "subtitle", "videoUrl", "posterUrl", "button1Text", "button1Link", "button2Text", "button2Link")
VALUES (
    'default',
    'Há 5 anos em Paranavaí e Região',
    'Duarte''s Limpezas,',
    'Desentupidora e',
    'Manutenções',
    'Soluções completas em limpeza, desentupimento e manutenção para residências, empresas e condomínios.',
    '/assets/hero-video.mp4',
    '/assets/gallery/g4.jpg',
    'Solicitar Orçamento',
    'https://wa.me/5544997069677?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20com%20a%20Duarte''s.',
    'Falar no WhatsApp',
    'https://wa.me/5544997069677?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Duarte''s%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.'
) ON CONFLICT ("id") DO NOTHING;

-- 4. Serviços Principais
INSERT INTO "ServiceItem" ("id", "title", "description", "icon", "buttonText", "order", "active") VALUES
('srv-01', 'Limpeza de Caixa d''Água', 'Higienização completa com produtos adequados, garantindo água limpa e segura para sua família.', 'Droplets', 'Solicitar orçamento', 1, TRUE),
('srv-02', 'Desentupimento', 'Desentupimento de pias, ralos, vasos e tubulações com equipamentos profissionais.', 'Waves', 'Solicitar orçamento', 2, TRUE),
('srv-03', 'Hidrojateamento', 'Limpeza de alta pressão para remover resíduos e restaurar o fluxo das tubulações.', 'Gauge', 'Solicitar orçamento', 3, TRUE),
('srv-04', 'Limpeza de Caixa de Gordura', 'Remoção e higienização de caixas de gordura para residências, comércios e condomínios.', 'Trash2', 'Solicitar orçamento', 4, TRUE),
('srv-05', 'Dedetização', 'Controle de pragas com produtos registrados e técnicas seguras para o ambiente.', 'Bug', 'Solicitar orçamento', 5, TRUE),
('srv-06', 'Manutenção Hidráulica', 'Reparos, instalações e manutenção preventiva em toda a parte hidráulica.', 'Wrench', 'Solicitar orçamento', 6, TRUE),
('srv-07', 'Manutenção Elétrica', 'Instalações e reparos elétricos com segurança e mão de obra qualificada.', 'Zap', 'Solicitar orçamento', 7, TRUE)
ON CONFLICT ("id") DO NOTHING;

-- 5. Galeria Inicial
INSERT INTO "GalleryMedia" ("id", "src", "alt", "order", "active") VALUES
('gal-01', '/assets/gallery/g1.jpg', 'Caixa d''água elevada e veículo da Duarte''s', 1, TRUE),
('gal-02', '/assets/gallery/g2.jpg', 'Manutenção de boia e válvula em reservatório', 2, TRUE),
('gal-03', '/assets/gallery/g3.jpg', 'Interior de caixa d''água higienizada', 3, TRUE),
('gal-04', '/assets/gallery/g4.jpg', 'Reservatório durante processo de limpeza', 4, TRUE),
('gal-05', '/assets/gallery/g5.jpg', 'Inspeção interna de caixa d''água', 5, TRUE)
ON CONFLICT ("id") DO NOTHING;

-- 6. Depoimentos de Clientes
INSERT INTO "TestimonialItem" ("id", "name", "role", "text", "rating", "order", "active") VALUES
('tst-01', 'Cliente Residencial', 'Paranavaí - PR', 'Excelente atendimento. Muito rápido e serviço impecável na limpeza da caixa d''água.', 5, 1, TRUE),
('tst-02', 'Síndico de Condomínio', 'Região Noroeste', 'Equipe pontual e profissional. Resolveram o desentupimento do prédio no mesmo dia.', 5, 2, TRUE),
('tst-03', 'Estabelecimento Comercial', 'Paranavaí - PR', 'Contratamos a manutenção hidráulica e ficamos impressionados com o comprometimento.', 5, 3, TRUE)
ON CONFLICT ("id") DO NOTHING;

-- 7. Perguntas Frequentes (FAQ)
INSERT INTO "FaqItem" ("id", "question", "answer", "order", "active") VALUES
('faq-01', 'Quanto custa um desentupimento?', 'O valor varia conforme o tipo e a extensão do entupimento. Fazemos uma avaliação e enviamos um orçamento sem compromisso pelo WhatsApp.', 1, TRUE),
('faq-02', 'Vocês atendem emergência?', 'Sim. Priorizamos atendimentos urgentes com agilidade. Entre em contato pelo WhatsApp e informamos a disponibilidade da equipe.', 2, TRUE),
('faq-03', 'Atendem condomínios?', 'Sim. Atendemos residências, empresas e condomínios em Paranavaí e toda a Região Noroeste do Paraná.', 3, TRUE),
('faq-04', 'Fazem limpeza de caixa d''água?', 'Sim. Realizamos higienização completa da caixa d''água, garantindo água limpa e segura para sua família ou empresa.', 4, TRUE),
('faq-05', 'Qual região atendem?', 'Atendemos Paranavaí e toda a Região Noroeste do Paraná.', 5, TRUE),
('faq-06', 'Como solicitar orçamento?', 'É simples: clique em qualquer botão de orçamento do site para falar direto no WhatsApp, ou ligue para nós. O orçamento é sem compromisso.', 6, TRUE)
ON CONFLICT ("id") DO NOTHING;

-- 8. Área de Atendimento
INSERT INTO "ServiceAreaConfig" ("id", "badgeText", "title", "description", "citiesJson", "mapUrl") VALUES
('default', 'Área de Atendimento', 'Atendemos Paranavaí e toda a Região Noroeste do Paraná', 'Nossa equipe se desloca com agilidade para atender residências, empresas e condomínios em toda a região.', '["Paranavaí","Nova Esperança","Alto Paraná","Mandaguaçu","Loanda","Terra Rica","Cruzeiro do Sul","Paraíso do Norte","Tamboara","Amaporã"]', 'https://www.google.com/maps?q=Paranava%C3%AD,PR&z=11&output=embed')
ON CONFLICT ("id") DO NOTHING;

-- 9. Configurações de Redes Sociais
INSERT INTO "SocialConfig" ("id", "instagram", "facebook", "whatsapp", "activeInsta", "activeFb", "activeWa") VALUES
('default', 'https://instagram.com/duarteslimpezacaixadeagua', 'https://facebook.com/duarteslimpezacaixadeagua', 'https://wa.me/5544997069677', TRUE, TRUE, TRUE)
ON CONFLICT ("id") DO NOTHING;

-- 10. SEO Config
INSERT INTO "SeoConfig" ("id", "metaTitle", "metaDescription", "keywords", "ogTitle", "ogDescription", "ogImage", "twitterCard", "canonicalUrl", "robots", "schemaLd") VALUES
('default', 'Duarte''s Limpezas | Desentupidora em Paranavaí', 'Empresa especializada em limpeza de caixa d''água, desentupimento, hidrojateamento, limpeza de fossa, caixa de gordura, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste do Paraná.', 'desentupidora Paranavaí, limpeza caixa d''água Paranavaí, hidrojateamento Paranavaí, limpeza caixa de gordura, limpeza de fossa, dedetização Paranavaí, manutenção hidráulica, manutenção elétrica', 'Duarte''s Limpezas | Desentupidora em Paranavaí', 'Limpeza de caixa d''água, desentupimento, hidrojateamento, dedetização e manutenção hidráulica e elétrica em Paranavaí e Região Noroeste.', '/assets/logo-hero.png', 'summary_large_image', 'https://manutencao-duartes.preview.emergentagent.com/', 'index, follow', '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Duarte''s Limpezas, Desentupidora e Manutenções","image":"/assets/logo-hero.png","telephone":"+5544997069677","email":"duarteslimpezacaixadeagua@gmail.com","address":{"@type":"PostalAddress","streetAddress":"Av. Paulino Rech, 203","addressLocality":"Paranavaí","addressRegion":"PR","postalCode":"87702-430","addressCountry":"BR"},"areaServed":"Paranavaí e Região Noroeste do Paraná","openingHours":"Mo-Fr 08:00-18:00"}')
ON CONFLICT ("id") DO NOTHING;

-- 11. Configurações Gerais do Site
INSERT INTO "SiteSettings" ("id", "logoUrl", "logoHeroUrl", "faviconUrl", "primaryColor", "accentColor", "footerText", "copyrightText", "waButtonText", "callButtonText") VALUES
('default', '/assets/logo.png', '/assets/logo-hero.png', '/assets/logo.png', '#0B3C5D', '#FFC107', 'Há 5 anos oferecendo soluções completas em limpeza, desentupimento e manutenção.', '© 2026 Duarte''s Limpezas, Desentupidora e Manutenções. Todos os direitos reservados.', 'Orçamento Rápido', 'Ligar Agora')
ON CONFLICT ("id") DO NOTHING;
